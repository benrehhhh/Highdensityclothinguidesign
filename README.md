# 🏪 High Density Clothing - E-commerce & Delivery Management System

A comprehensive GPS-based delivery tracking and e-commerce management system with separate customer and admin interfaces.

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install express cors
npm install sqlite3
npm install
```


### Run Development Server
```bash
npm run backend
npm run dev
```
The Vite dev server is already running. View the preview in your browser.

### Login Credentials

**Admin Access:**
- Email: `admin@highdensity.com`
- Password: `Admin123`
- Route: `/admin`

**Customer Access:**
- Register at `/register`
- Then login at `/login`
- Routes: `/home/*`

---

## ✨ Features

### Customer Side
✅ Product catalog & search  
✅ Shopping cart & checkout  
✅ GPS order tracking  
✅ User dashboard (profile, orders, wishlist, addresses, notifications)  
✅ Reviews & wishlist  

### Admin Side
✅ Dashboard with analytics  
✅ Product management (CRUD, variants, bulk upload)  
✅ Inventory management  
✅ Discount management (coupons, flash sales, BOGO, loyalty)  
✅ Customer management  
✅ GPS delivery tracking & courier assignment  
✅ Reports  
✅ Settings (profile, security, password, notifications) ⭐ NEW  

---

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router v7** for routing
- **Tailwind CSS v4** for styling
- **Leaflet** for GPS maps
- **Recharts** for analytics charts
- **Radix UI** for accessible components
- **Sonner** for toast notifications
- **localStorage** for data persistence
- **Node.js**
- **Express**
- **SQLite**

---

## 📄 Routes Overview

### Public Routes
- `/` - Landing page
- `/login` - Unified login (admin/customer)
- `/register` - Customer registration

### Customer Routes (`/home/*`)
- `/home` - Homepage
- `/home/catalog` - Product catalog
- `/home/product/:id` - Product details
- `/home/cart` - Shopping cart
- `/home/checkout` - Checkout
- `/home/account` - User dashboard
- `/home/track-order` - GPS order tracking
- `/home/wishlist` - Wishlist
- `/home/reviews` - Reviews
- `/home/notifications` - Notifications

### Admin Routes (`/admin/*`)
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/inventory` - Inventory
- `/admin/discounts` - Discounts & promotions
- `/admin/customers` - Customer management
- `/admin/delivery` - GPS delivery tracking
- `/admin/reports` - Reports
- `/admin/settings` - Admin settings ⭐ NEW

---

## 🎨 Design Theme

**Admin Panel:** Professional gray/black/white theme  
**Customer Interface:** Brown/tan clothing retail aesthetic (`#B7885E`, `#3B2C24`)
