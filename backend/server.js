import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "hdc.sqlite");
const app = express();
const port = Number(process.env.PORT || 4001);
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json({ limit: "5mb" }));

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function setupDb() {
  // Users table
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    phone TEXT,
    address TEXT,
    joined TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  await run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    sizes TEXT NOT NULL,
    colors TEXT NOT NULL,
    image TEXT NOT NULL,
    badge TEXT,
    description TEXT,
    materials TEXT,
    care TEXT,
    status TEXT DEFAULT 'Active'
  )`);

  // Inventory table
  await run(`CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER DEFAULT 10,
    supplier_details TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Orders table
  await run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    total REAL NOT NULL,
    items_count INTEGER NOT NULL,
    shipping_address TEXT,
    payment_method TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Order Items table
  await run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    size TEXT,
    color TEXT,
    image TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Discounts table
  await run(`CREATE TABLE IF NOT EXISTS discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    value REAL NOT NULL,
    value_type TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    min_purchase REAL DEFAULT 0,
    max_uses INTEGER DEFAULT 0,
    current_uses INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active'
  )`);

  // Wishlist table
  await run(`CREATE TABLE IF NOT EXISTS wishlist (
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Cart table
  await run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Notifications table
  await run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    time TEXT DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Delivery table
  await run(`CREATE TABLE IF NOT EXISTS delivery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    items_summary TEXT,
    tracking_number TEXT,
    status TEXT NOT NULL,
    placed_date TEXT,
    estimated_delivery TEXT,
    courier TEXT,
    rider_name TEXT,
    rider_contact TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  )`);

  await seedIfEmpty();
}

async function seedIfEmpty() {
  const productCount = await get("SELECT COUNT(*) as count FROM products");
  if (productCount.count > 0) return;

  // Seed Admin and Demo User
  await run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", ["Admin", "admin@highdensity.ph", "admin123", "admin"]);
  await run("INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)", ["Maria Santos", "maria@email.com", "user123", "customer", "09171234567", "Quezon City, Metro Manila"]);

  const products = [
    ["Handcrafted Cotton Shirt", "Tops", 1299, 1499, 4.8, 124, JSON.stringify(["XS", "S", "M", "L", "XL"]), JSON.stringify(["Beige", "Cream", "Brown"]), "https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "Bestseller", "Premium handmade cotton shirt.", "100% Organic Cotton", "Hand wash cold."],
    ["Linen Casual Polo", "Tops", 1599, 1899, 4.6, 85, JSON.stringify(["S", "M", "L", "XL"]), JSON.stringify(["White", "Beige", "Gray"]), "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "New", "Breathable linen polo.", "100% Belgian Linen", "Machine wash cold."],
    ["Premium Cotton Jacket", "Outerwear", 2499, 2999, 4.9, 42, JSON.stringify(["M", "L", "XL", "XXL"]), JSON.stringify(["Brown", "Black", "Navy"]), "https://images.unsplash.com/photo-1619708838487-d18b744f2ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "Premium", "Durable cotton jacket.", "Heavyweight Cotton Twill", "Dry clean."],
    ["Artisan Cotton Shirt", "Tops", 1399, 1599, 4.7, 63, JSON.stringify(["XS", "S", "M", "L"]), JSON.stringify(["Cream", "Beige", "White"]), "https://images.unsplash.com/photo-1759366079659-dc182506fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "Featured", "Artisan-crafted shirt.", "Hand-loomed Cotton", "Hand wash."]
  ];

  for (const p of products) {
    const result = await run("INSERT INTO products (name, category, price, original_price, rating, review_count, sizes, colors, image, badge, description, materials, care) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", p);
    await run("INSERT INTO inventory (product_id, stock) VALUES (?, ?)", [result.lastID, 20]);
  }

  await run("INSERT INTO wishlist (user_id, product_id) VALUES (2, 1)");
  await run("INSERT INTO notifications (user_id, type, title, message) VALUES (2, 'promo', 'Welcome!', 'Thank you for joining High Density!')");
  await run("INSERT INTO discounts (code, type, value, value_type, start_date, end_date) VALUES ('WELCOME10', 'Coupon', 10, 'Percentage', '2024-01-01', '2026-12-31')");
}

function mapProduct(row) {
  if (!row) return null;
  return {
    ...row,
    originalPrice: row.original_price,
    reviewCount: row.review_count,
    sizes: JSON.parse(row.sizes || "[]"),
    colors: JSON.parse(row.colors || "[]"),
    inStock: Boolean(row.stock > 0)
  };
}

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.get("/api/products", async (_, res) => {
  const rows = await all("SELECT * FROM products ORDER BY id");
  res.json(rows.map(mapProduct));
});

app.get("/api/products/:id", async (req, res) => {
  const row = await get("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!row) return res.status(404).json({ message: "Product not found" });
  res.json(mapProduct(row));
});

app.get("/api/admin/products", async (_, res) => {
  const rows = await all("SELECT * FROM products ORDER BY id DESC");
  res.json(rows.map(mapProduct));
});

app.post("/api/admin/products", async (req, res) => {
  const p = req.body;
  await run(`INSERT INTO products (
    name, category, price, original_price, rating, review_count, 
    sizes, colors, image, badge, description, materials, care, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
    p.name, p.category, p.price, p.originalPrice || p.price, p.rating || 0, p.reviewCount || 0,
    JSON.stringify(p.sizes || []), JSON.stringify(p.colors || []), 
    p.image || "", p.badge || null, p.description || "", 
    p.materials || "", p.care || "", p.status || 'Active'
  ]);
  res.json({ success: true });
});

app.put("/api/admin/products/:id", async (req, res) => {
  const p = req.body;
  await run(`UPDATE products SET 
    name=?, category=?, price=?, original_price=?, sizes=?, colors=?, 
    image=?, badge=?, description=?, materials=?, care=?, status=? 
    WHERE id=?`, [
    p.name, p.category, p.price, p.originalPrice || p.price, 
    JSON.stringify(p.sizes || []), JSON.stringify(p.colors || []), 
    p.image || "", p.badge || null, p.description || "", 
    p.materials || "", p.care || "", p.status || 'Active', 
    req.params.id
  ]);
  res.json({ success: true });
});

app.delete("/api/admin/products/:id", async (req, res) => {
  await run("DELETE FROM products WHERE id = ?", [req.params.id]);
  await run("DELETE FROM inventory WHERE product_id = ?", [req.params.id]);
  res.json({ success: true });
});

app.get("/api/admin/orders", async (_, res) => {
  const rows = await all("SELECT * FROM orders ORDER BY date DESC");
  res.json(rows);
});

app.get("/api/admin/inventory", async (_, res) => {
  const rows = await all(`
    SELECT i.*, p.name, p.category, p.image 
    FROM inventory i 
    JOIN products p ON i.product_id = p.id
  `);
  res.json(rows);
});

app.patch("/api/admin/inventory/:id", async (req, res) => {
  await run("UPDATE inventory SET stock = ? WHERE id = ?", [req.body.stock, req.params.id]);
  res.json({ success: true });
});

app.get("/api/admin/customers", async (_, res) => {
  const rows = await all("SELECT * FROM users WHERE role = 'customer'");
  res.json(rows);
});

app.get("/api/admin/discounts", async (_, res) => {
  const rows = await all("SELECT * FROM discounts ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/admin/discounts", async (req, res) => {
  const d = req.body;
  await run(`INSERT INTO discounts (code, type, value, value_type, start_date, end_date, min_purchase, max_uses, current_uses, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
    [d.code, d.type, d.value, d.value_type, d.start_date, d.end_date, d.min_purchase || 0, d.max_uses || 0, 0, d.status || 'Active']);
  res.json({ success: true });
});

app.get("/api/admin/delivery", async (_, res) => {
  const rows = await all("SELECT * FROM delivery ORDER BY id DESC");
  res.json(rows);
});

app.get("/api/admin/reports", async (req, res) => {
  const range = req.query.range || '30d';
  let dateFilter = "date('now', '-30 days')";
  if (range === '7d') dateFilter = "date('now', '-7 days')";
  else if (range === '90d') dateFilter = "date('now', '-90 days')";
  else if (range === 'year') dateFilter = "date('now', 'start of year')";

  const summary = await get(`
    SELECT 
      COALESCE(AVG(total), 0) as avgOrderValue,
      COALESCE(SUM(items_count), 0) as totalItemsSold
    FROM orders WHERE date >= ${dateFilter}
  `);

  const lowStock = await get("SELECT COUNT(*) as count FROM inventory WHERE stock <= reorder_point");
  
  const salesData = await all(`
    SELECT 
      strftime('%m/%d', date) as label, 
      SUM(total) as sales 
    FROM orders 
    WHERE date >= ${dateFilter}
    GROUP BY strftime('%m/%d', date) 
    ORDER BY date ASC
  `);

  const statusBreakdown = await all(`
    SELECT status, COUNT(*) as count 
    FROM delivery 
    GROUP BY status
  `);

  const topProducts = await all(`
    SELECT p.id as productId, p.name, SUM(oi.quantity) as quantity, SUM(oi.price * oi.quantity) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.date >= ${dateFilter}
    GROUP BY p.id
    ORDER BY revenue DESC
    LIMIT 5
  `);

  const topCustomers = await all(`
    SELECT u.name as customer, u.id as userId, COUNT(o.id) as orders, SUM(o.total) as spent
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.date >= ${dateFilter}
    GROUP BY u.id
    ORDER BY spent DESC
    LIMIT 5
  `);

  res.json({
    summary: {
      avgOrderValue: summary.avgOrderValue,
      totalItemsSold: summary.totalItemsSold,
      lowStockAlerts: lowStock.count
    },
    salesData,
    statusBreakdown,
    topProducts,
    topCustomers
  });
});

app.get("/api/admin/reports/overview", async (_, res) => {
  const revenue = await get("SELECT SUM(total) as value FROM orders");
  const orders = await get("SELECT COUNT(*) as count FROM orders");
  const delivered = await get("SELECT COUNT(*) as count FROM delivery WHERE status = 'Delivered'");
  const processing = await get("SELECT COUNT(*) as count FROM delivery WHERE status = 'Processing'");
  
  const monthly = await all(`
    SELECT 
      strftime('%b', date) as month, 
      SUM(total) as sales, 
      COUNT(*) as orders 
    FROM orders 
    GROUP BY strftime('%m', date) 
    ORDER BY date ASC
  `);

  const topProducts = await all(`
    SELECT p.name, i.stock, p.price
    FROM products p
    JOIN inventory i ON p.id = i.product_id
    ORDER BY i.stock DESC
    LIMIT 10
  `);

  res.json({
    kpis: {
      revenue: revenue.value || 0,
      orders: orders.count || 0,
      delivered: delivered.count || 0,
      processing: processing.count || 0
    },
    monthly,
    topProducts
  });
});

// Customer "Me" Endpoints (using hardcoded user_id 2 for demo)
const DEMO_USER_ID = 2;

app.get("/api/me/profile", async (_, res) => {
  const user = await get("SELECT * FROM users WHERE id = ?", [DEMO_USER_ID]);
  res.json(user);
});

app.put("/api/me/profile", async (req, res) => {
  const { name, email, phone, address } = req.body;
  await run("UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?", 
    [name, email, phone, address, DEMO_USER_ID]);
  res.json({ success: true });
});

app.get("/api/me/cart", async (_, res) => {
  const rows = await all("SELECT * FROM cart WHERE user_id = ?", [DEMO_USER_ID]);
  res.json(rows);
});

app.post("/api/me/cart/items", async (req, res) => {
  const item = req.body;
  await run(`INSERT INTO cart (user_id, product_id, name, price, size, color, quantity, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [DEMO_USER_ID, item.productId, item.name, item.price, item.size, item.color, item.quantity, item.image]);
  res.json({ success: true });
});

app.patch("/api/me/cart/items/:id", async (req, res) => {
  await run("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?", [req.body.quantity, req.params.id, DEMO_USER_ID]);
  res.json({ success: true });
});

app.delete("/api/me/cart/:id", async (req, res) => {
  await run("DELETE FROM cart WHERE id = ? AND user_id = ?", [req.params.id, DEMO_USER_ID]);
  res.json({ success: true });
});

app.patch("/api/me/notifications/:id", async (req, res) => {
  await run("UPDATE notifications SET is_read = ? WHERE id = ? AND user_id = ?", [req.body.read ? 1 : 0, req.params.id, DEMO_USER_ID]);
  res.json({ success: true });
});

app.post("/api/me/notifications/read-all", async (_, res) => {
  await run("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [DEMO_USER_ID]);
  res.json({ success: true });
});

app.patch("/api/admin/delivery/:id", async (req, res) => {
  const { status, courier, rider_name, rider_contact, estimated_delivery } = req.body;
  await run(`UPDATE delivery SET 
    status = COALESCE(?, status), 
    courier = COALESCE(?, courier), 
    rider_name = COALESCE(?, rider_name), 
    rider_contact = COALESCE(?, rider_contact), 
    estimated_delivery = COALESCE(?, estimated_delivery) 
    WHERE id = ?`, 
    [status, courier, rider_name, rider_contact, estimated_delivery, req.params.id]);
  res.json({ success: true });
});

app.patch("/api/admin/delivery/:id/status", async (req, res) => {
  await run("UPDATE delivery SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  res.json({ success: true });
});

app.patch("/api/admin/orders/:id", async (req, res) => {
  await run("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  res.json({ success: true });
});

app.get("/api/me/wishlist", async (_, res) => {
  const rows = await all(`
    SELECT p.* 
    FROM wishlist w 
    JOIN products p ON w.product_id = p.id 
    WHERE w.user_id = ?`, [DEMO_USER_ID]);
  res.json(rows.map(mapProduct));
});

app.post("/api/me/wishlist", async (req, res) => {
  await run("INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)", [DEMO_USER_ID, req.body.productId]);
  res.json({ success: true });
});

app.delete("/api/me/wishlist/:productId", async (req, res) => {
  await run("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", [DEMO_USER_ID, req.params.productId]);
  res.json({ success: true });
});

app.get("/api/me/notifications", async (_, res) => {
  const rows = await all("SELECT * FROM notifications WHERE user_id = ? ORDER BY time DESC", [DEMO_USER_ID]);
  res.json(rows.map(n => ({ ...n, read: Boolean(n.is_read) })));
});

app.get("/api/me/orders", async (_, res) => {
  const rows = await all("SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC", [DEMO_USER_ID]);
  res.json(rows);
});

app.post("/api/me/orders", async (req, res) => {
  const { total, items, shippingAddress, paymentMethod } = req.body;
  const orderId = "HD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  const date = new Date().toISOString();
  
  await run(`INSERT INTO orders (id, user_id, date, status, total, items_count, shipping_address, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [orderId, DEMO_USER_ID, date, 'Processing', total, items.length, shippingAddress, paymentMethod]);

  for (const item of items) {
    await run(`INSERT INTO order_items (order_id, product_id, name, price, quantity, size, color, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, item.productId, item.name, item.price, item.quantity, item.size, item.color, item.image]);
    
    // Decrease stock
    await run("UPDATE inventory SET stock = stock - ? WHERE product_id = ?", [item.quantity, item.productId]);
  }

  // Clear cart
  await run("DELETE FROM cart WHERE user_id = ?", [DEMO_USER_ID]);

  // Create Delivery entry
  const user = await get("SELECT name FROM users WHERE id = ?", [DEMO_USER_ID]);
  await run(`INSERT INTO delivery (order_id, customer_name, address, status, placed_date)
    VALUES (?, ?, ?, ?, ?)`, [orderId, user.name, shippingAddress, 'Processing', date]);

  res.json({ success: true, orderId });
});

app.get("/api/admin/dashboard/summary", async (_, res) => {
  const ordersToday = await get("SELECT COUNT(*) as count FROM orders WHERE date >= date('now')");
  const pending = await get("SELECT COUNT(*) as count FROM delivery WHERE status NOT IN ('Delivered', 'Cancelled')");
  const lowStock = await get("SELECT COUNT(*) as count FROM inventory WHERE stock <= reorder_point");
  const sales = await get("SELECT COALESCE(SUM(total), 0) as value FROM orders WHERE date >= date('now', 'start of month')");
  
  // Real-time sales trend (last 6 months)
  const monthlySales = await all(`
    SELECT 
      strftime('%b', date) as month, 
      SUM(total) as sales, 
      COUNT(*) as orders 
    FROM orders 
    GROUP BY strftime('%m', date) 
    ORDER BY date DESC 
    LIMIT 6
  `);

  res.json({
    ordersToday: ordersToday.count,
    pendingDeliveries: pending.count,
    lowStockAlerts: lowStock.count,
    monthlySales: sales.value,
    salesTrend: monthlySales.reverse()
  });
});

setupDb()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Backend running at http://localhost:${port}`);
    });
    server.on("error", (error) => {
      console.error("Backend server error", error);
    });
  })
  .catch((error) => {
    console.error("Failed to start backend", error);
    process.exit(1);
  });
