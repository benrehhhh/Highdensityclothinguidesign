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

async function seedIfEmpty() {
  const productCount = await get("SELECT COUNT(*) as count FROM products");
  if (productCount.count > 0) {
    return;
  }

  const products = [
    ["Handcrafted Cotton Shirt", "Tops", 1299, JSON.stringify(["XS", "S", "M", "L", "XL"]), JSON.stringify(["Beige", "Cream", "Brown"]), "https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "Bestseller", 1, 15, "Premium handmade cotton shirt with meticulous attention to detail."],
    ["Linen Casual Polo", "Tops", 1599, JSON.stringify(["S", "M", "L", "XL"]), JSON.stringify(["White", "Beige", "Gray"]), "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "New", 1, 20, "Breathable linen polo for daily comfort."],
    ["Premium Cotton Jacket", "Outerwear", 2499, JSON.stringify(["M", "L", "XL", "XXL"]), JSON.stringify(["Brown", "Black", "Navy"]), "https://images.unsplash.com/photo-1619708838487-d18b744f2ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "Premium", 1, 8, "Durable cotton jacket with premium finish."],
    ["Artisan Cotton Shirt", "Tops", 1399, JSON.stringify(["XS", "S", "M", "L"]), JSON.stringify(["Cream", "Beige", "White"]), "https://images.unsplash.com/photo-1759366079659-dc182506fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", "Featured", 1, 12, "Artisan-crafted cotton shirt for all-day wear."]
  ];

  for (const p of products) {
    await run("INSERT INTO products (name, category, price, sizes, colors, image, badge, inStock, stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", p);
  }

  await run("INSERT INTO wishlist (product_id) VALUES (1)");
  await run("INSERT INTO wishlist (product_id) VALUES (3)");

  await run("INSERT INTO notifications (type, title, message, time, is_read) VALUES ('delivery', 'Order Delivered', 'Your order ORD-001 has been delivered.', '2 hours ago', 0)");
  await run("INSERT INTO notifications (type, title, message, time, is_read) VALUES ('promo', 'Weekend Sale', '20% off on selected items this weekend.', '1 day ago', 0)");

  await run("INSERT INTO orders (id, date, status, total, items) VALUES ('ORD-001', '2024-03-15', 'Delivered', 2598, 2)");
  await run("INSERT INTO orders (id, date, status, total, items) VALUES ('ORD-002', '2024-03-10', 'In Transit', 1599, 1)");
  await run("INSERT INTO orders (id, date, status, total, items) VALUES ('ORD-003', '2024-03-05', 'Processing', 4297, 3)");

  await run("INSERT INTO customers (name, email, phone, address, orders, total_spent, tag, joined, last_order, notes) VALUES ('Maria Santos', 'maria.santos@email.com', '0917 123 4567', 'Quezon City, Metro Manila', 8, 12450, 'VIP', '2024-01-15', '2024-03-10', 'Prefers beige and cream colors.')");
  await run("INSERT INTO discounts (code, type, value, value_type, start_date, end_date, min_purchase, max_uses, current_uses, status) VALUES ('SUMMER25', 'Coupon', 25, 'Percentage', '2026-04-01', '2026-06-30', 1000, 100, 45, 'Active')");
  await run("INSERT INTO delivery (order_id, customer, address, items, tracking_number, status, placed_date, estimated_delivery, courier, rider_name, rider_contact) VALUES ('ORD-001', 'Maria Santos', 'Quezon City, Metro Manila', 'Cotton Shirt (x2)', 'TRK123456789PH', 'Out for Delivery', '2026-04-12', '2026-04-14', 'J&T Express', 'Juan Santos', '0917-123-4567')");
}

async function setupDb() {
  await run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL, price REAL NOT NULL, sizes TEXT NOT NULL, colors TEXT NOT NULL, image TEXT NOT NULL, badge TEXT, inStock INTEGER NOT NULL DEFAULT 1, stock INTEGER NOT NULL DEFAULT 0, description TEXT)");
  await run("CREATE TABLE IF NOT EXISTS cart_items (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, name TEXT NOT NULL, price REAL NOT NULL, size TEXT NOT NULL, color TEXT NOT NULL, quantity INTEGER NOT NULL, image TEXT NOT NULL)");
  await run("CREATE TABLE IF NOT EXISTS wishlist (product_id INTEGER PRIMARY KEY)");
  await run("CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, time TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0)");
  await run("CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, date TEXT NOT NULL, status TEXT NOT NULL, total REAL NOT NULL, items INTEGER NOT NULL)");
  await run("CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, orders INTEGER NOT NULL, total_spent REAL NOT NULL, tag TEXT NOT NULL, joined TEXT NOT NULL, last_order TEXT NOT NULL, notes TEXT DEFAULT '')");
  await run("CREATE TABLE IF NOT EXISTS discounts (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, type TEXT NOT NULL, value REAL NOT NULL, value_type TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, min_purchase REAL NOT NULL, max_uses INTEGER NOT NULL, current_uses INTEGER NOT NULL, status TEXT NOT NULL)");
  await run("CREATE TABLE IF NOT EXISTS delivery (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT NOT NULL, customer TEXT NOT NULL, address TEXT NOT NULL, items TEXT NOT NULL, tracking_number TEXT, status TEXT NOT NULL, placed_date TEXT NOT NULL, estimated_delivery TEXT NOT NULL, courier TEXT, rider_name TEXT, rider_contact TEXT)");
  await seedIfEmpty();
}

function mapProduct(row) {
  return {
    ...row,
    sizes: JSON.parse(row.sizes),
    colors: JSON.parse(row.colors),
    inStock: Boolean(row.inStock)
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

app.get("/api/me/cart", async (_, res) => {
  const rows = await all("SELECT id, product_id as productId, name, price, size, color, quantity, image FROM cart_items ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/me/cart/items", async (req, res) => {
  const { productId, name, price, size, color, quantity, image } = req.body;
  const existing = await get("SELECT id, quantity FROM cart_items WHERE product_id = ? AND size = ? AND color = ?", [productId, size, color]);
  if (existing) {
    await run("UPDATE cart_items SET quantity = ? WHERE id = ?", [existing.quantity + quantity, existing.id]);
  } else {
    await run("INSERT INTO cart_items (product_id, name, price, size, color, quantity, image) VALUES (?, ?, ?, ?, ?, ?, ?)", [productId, name, price, size, color, quantity, image]);
  }
  res.json({ success: true });
});

app.patch("/api/me/cart/items/:id", async (req, res) => {
  await run("UPDATE cart_items SET quantity = ? WHERE id = ?", [req.body.quantity, req.params.id]);
  res.json({ success: true });
});

app.delete("/api/me/cart/items/:id", async (req, res) => {
  await run("DELETE FROM cart_items WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.get("/api/me/wishlist", async (_, res) => {
  const rows = await all("SELECT p.* FROM products p JOIN wishlist w ON w.product_id = p.id ORDER BY p.id");
  res.json(rows.map(mapProduct));
});

app.post("/api/me/wishlist/:productId", async (req, res) => {
  await run("INSERT OR IGNORE INTO wishlist (product_id) VALUES (?)", [req.params.productId]);
  res.json({ success: true });
});

app.delete("/api/me/wishlist/:productId", async (req, res) => {
  await run("DELETE FROM wishlist WHERE product_id = ?", [req.params.productId]);
  res.json({ success: true });
});

app.get("/api/me/notifications", async (_, res) => {
  const rows = await all("SELECT id, type, title, message, time, is_read as read FROM notifications ORDER BY id DESC");
  res.json(rows.map((n) => ({ ...n, read: Boolean(n.read) })));
});

app.patch("/api/me/notifications/:id/read", async (req, res) => {
  await run("UPDATE notifications SET is_read = 1 WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.patch("/api/me/notifications/read-all", async (_, res) => {
  await run("UPDATE notifications SET is_read = 1");
  res.json({ success: true });
});

app.get("/api/me/orders", async (_, res) => {
  const rows = await all("SELECT * FROM orders ORDER BY date DESC");
  res.json(rows);
});

app.get("/api/admin/products", async (_, res) => {
  const rows = await all("SELECT * FROM products ORDER BY id DESC");
  res.json(rows.map(mapProduct));
});

app.post("/api/admin/products", async (req, res) => {
  const p = req.body;
  await run("INSERT INTO products (name, category, price, sizes, colors, image, badge, inStock, stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [p.name, p.category, p.price, JSON.stringify(p.sizes || []), JSON.stringify(p.colors || []), p.image || "", p.badge || null, p.inStock ? 1 : 0, p.stock || 0, p.description || ""]);
  res.json({ success: true });
});

app.put("/api/admin/products/:id", async (req, res) => {
  const p = req.body;
  await run("UPDATE products SET name=?, category=?, price=?, sizes=?, colors=?, image=?, badge=?, inStock=?, stock=?, description=? WHERE id=?", [p.name, p.category, p.price, JSON.stringify(p.sizes || []), JSON.stringify(p.colors || []), p.image || "", p.badge || null, p.inStock ? 1 : 0, p.stock || 0, p.description || "", req.params.id]);
  res.json({ success: true });
});

app.delete("/api/admin/products/:id", async (req, res) => {
  await run("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.get("/api/admin/customers", async (_, res) => res.json(await all("SELECT * FROM customers ORDER BY id DESC")));
app.patch("/api/admin/customers/:id", async (req, res) => {
  const customer = req.body;
  await run("UPDATE customers SET name=?, email=?, phone=?, address=?, orders=?, total_spent=?, tag=?, joined=?, last_order=?, notes=? WHERE id=?", [
    customer.name,
    customer.email,
    customer.phone,
    customer.address,
    customer.orders,
    customer.total_spent,
    customer.tag,
    customer.joined,
    customer.last_order,
    customer.notes || "",
    req.params.id
  ]);
  res.json({ success: true });
});

app.get("/api/admin/orders", async (_, res) => res.json(await all("SELECT * FROM orders ORDER BY date DESC")));

app.get("/api/admin/inventory", async (_, res) => {
  const rows = await all("SELECT id, name, category, stock, sizes, price FROM products ORDER BY id DESC");
  res.json(rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    stock: row.stock,
    variants: JSON.parse(row.sizes).join(", "),
    cost: row.price,
    status: row.stock <= 10 ? "Low Stock" : "In Stock"
  })));
});

app.patch("/api/admin/inventory/:id", async (req, res) => {
  await run("UPDATE products SET stock = ? WHERE id = ?", [req.body.stock, req.params.id]);
  res.json({ success: true });
});

app.get("/api/admin/discounts", async (_, res) => res.json(await all("SELECT * FROM discounts ORDER BY id DESC")));
app.post("/api/admin/discounts", async (req, res) => {
  const discount = req.body;
  await run("INSERT INTO discounts (code, type, value, value_type, start_date, end_date, min_purchase, max_uses, current_uses, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
    discount.code,
    discount.type,
    discount.value,
    discount.valueType || discount.value_type,
    discount.startDate || discount.start_date,
    discount.endDate || discount.end_date,
    discount.minPurchase || discount.min_purchase || 0,
    discount.maxUses || discount.max_uses || 0,
    discount.currentUses || discount.current_uses || 0,
    discount.status || "Active"
  ]);
  res.json({ success: true });
});
app.put("/api/admin/discounts/:id", async (req, res) => {
  const discount = req.body;
  await run("UPDATE discounts SET code=?, type=?, value=?, value_type=?, start_date=?, end_date=?, min_purchase=?, max_uses=?, current_uses=?, status=? WHERE id=?", [
    discount.code,
    discount.type,
    discount.value,
    discount.valueType || discount.value_type,
    discount.startDate || discount.start_date,
    discount.endDate || discount.end_date,
    discount.minPurchase || discount.min_purchase || 0,
    discount.maxUses || discount.max_uses || 0,
    discount.currentUses || discount.current_uses || 0,
    discount.status || "Active",
    req.params.id
  ]);
  res.json({ success: true });
});
app.delete("/api/admin/discounts/:id", async (req, res) => {
  await run("DELETE FROM discounts WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.get("/api/admin/delivery", async (_, res) => res.json(await all("SELECT * FROM delivery ORDER BY id DESC")));

app.patch("/api/admin/delivery/:id/status", async (req, res) => {
  await run("UPDATE delivery SET status = ? WHERE id = ?", [req.body.status, req.params.id]);
  res.json({ success: true });
});
app.patch("/api/admin/delivery/:id", async (req, res) => {
  const d = req.body;
  await run("UPDATE delivery SET courier=?, rider_name=?, rider_contact=?, tracking_number=?, status=? WHERE id=?", [
    d.courier,
    d.riderName || d.rider_name,
    d.riderContact || d.rider_contact,
    d.trackingNumber || d.tracking_number,
    d.status,
    req.params.id
  ]);
  res.json({ success: true });
});

app.get("/api/admin/dashboard/summary", async (_, res) => {
  const ordersToday = await get("SELECT COUNT(*) as count FROM orders");
  const pending = await get("SELECT COUNT(*) as count FROM delivery WHERE status != 'Delivered'");
  const lowStock = await get("SELECT COUNT(*) as count FROM products WHERE stock <= 10");
  const sales = await get("SELECT COALESCE(SUM(total), 0) as value FROM orders");
  res.json({
    ordersToday: ordersToday.count,
    pendingDeliveries: pending.count,
    lowStockAlerts: lowStock.count,
    monthlySales: sales.value
  });
});

app.get("/api/admin/reports/overview", async (_, res) => {
  const revenue = await get("SELECT COALESCE(SUM(total), 0) as total FROM orders");
  const orders = await get("SELECT COUNT(*) as count FROM orders");
  const delivered = await get("SELECT COUNT(*) as count FROM delivery WHERE status='Delivered'");
  const processing = await get("SELECT COUNT(*) as count FROM delivery WHERE status!='Delivered'");
  const topProducts = await all("SELECT name, stock, price FROM products ORDER BY stock DESC LIMIT 5");
  const monthly = await all("SELECT substr(date,1,7) as month, SUM(total) as sales, COUNT(*) as orders FROM orders GROUP BY substr(date,1,7) ORDER BY month");
  res.json({
    kpis: {
      revenue: revenue.total,
      orders: orders.count,
      delivered: delivered.count,
      processing: processing.count
    },
    monthly,
    topProducts
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
