# 🏪 High Density Clothing - E-commerce & Delivery Management System

A comprehensive GPS-based delivery tracking and e-commerce management system with separate customer and admin interfaces.

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
npm run backend
npm run dev
```


### Run Development Server
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

## 📊 Project Stats

- **Page Files:** 22
- **UI Components:** 14 (cleaned from 46)
- **Layout Components:** 3
- **Total Component Files:** 18

---

## 🗂️ File Structure

```
src/app/
├── components/
│   ├── ui/                  (14 active components)
│   ├── figma/              (Image components)
│   ├── admin-layout.tsx
│   ├── customer-layout.tsx
│   └── map-wrapper.tsx
├── pages/
│   ├── customer/           (11 customer pages)
│   ├── auth/               (registration)
│   └── [admin pages]       (8 admin pages)
├── App.tsx
└── routes.ts
```

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

---

## 📝 Recent Updates (April 20, 2026)

1. ✅ Added comprehensive admin settings page
2. ✅ Removed 32 unused UI components
3. ✅ Created detailed documentation
4. ✅ Cleaned up unused files
5. ✅ Updated admin navigation with Settings link

---

## 📖 Need Help?

- See **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** for detailed file and feature documentation
- See **[CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md)** for recent changes and cleanup details
- Check `src/app/routes.ts` for all available routes
- Check `src/app/components/ui/` for available UI components

---

**Status:** ✅ Production Ready  
**Last Updated:** April 20, 2026
