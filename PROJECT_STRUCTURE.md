# High Density Clothing - Project Structure & File Usage

## 📁 Project Overview
This is a GPS-based delivery tracking and e-commerce management system with customer and admin interfaces.

---

## 🔑 Core Application Files

### Entry Point
- **`src/app/App.tsx`** - Main application component with router setup
- **`src/app/routes.ts`** - Central routing configuration for all pages

### Layouts
- **`src/app/components/admin-layout.tsx`**
  - Used by: All admin pages (`/admin/*`)
  - Features: Collapsible sidebar, navigation menu, logout functionality
  - UI Components: `button`

- **`src/app/components/customer-layout.tsx`**
  - Used by: All customer pages (`/home/*`, `/about`, `/contact`)
  - Features: Header with cart/wishlist badges, user dropdown, mobile menu
  - UI Components: `button`, `input`, `badge`, `dropdown-menu`

- **`src/app/components/map-wrapper.tsx`**
  - Used by: `order-tracking.tsx`, `delivery.tsx`
  - Purpose: Custom Leaflet map component (replaces react-leaflet)
  - Dependencies: `leaflet`, vanilla JavaScript

---

## 📄 Page Files & Their Purpose

### Authentication & Landing
| File | Route | Purpose | UI Components Used |
|------|-------|---------|-------------------|
| `pages/landing.tsx` | `/` | Landing/home page (manually edited by user) | - |
| `pages/unified-login.tsx` | `/login` | Unified login for admin and customers | `card`, `input`, `label`, `button`, `tabs` |
| `pages/auth/register.tsx` | `/register` | User registration form | `card`, `input`, `label`, `button` |

### Customer Pages (Route: `/home/*`)
| File | Route | Purpose | UI Components Used |
|------|-------|---------|-------------------|
| `pages/customer/homepage.tsx` | `/home` | Customer homepage (manually edited) | - |
| `pages/customer/catalog.tsx` | `/home/catalog` | Product catalog/browse | - |
| `pages/customer/product-details.tsx` | `/home/product/:id` | Individual product page | - |
| `pages/customer/cart.tsx` | `/home/cart` | Shopping cart | `card`, `button`, `input` |
| `pages/customer/checkout.tsx` | `/home/checkout` | Checkout process | `card`, `input`, `label`, `button`, `radio-group`, `separator` |
| `pages/customer/user-dashboard.tsx` | `/home/account` | User account with profile, orders, wishlist, addresses, notifications | `card`, `input`, `label`, `button`, `tabs`, `avatar`, `badge`, `separator` |
| `pages/customer/order-tracking.tsx` | `/home/track-order` | GPS-based order tracking with live map | `card`, `badge`, `separator` + `map-wrapper` |
| `pages/customer/wishlist.tsx` | `/home/wishlist` | Saved wishlist items | - |
| `pages/customer/reviews.tsx` | `/home/reviews` | Product reviews | - |
| `pages/customer/notifications.tsx` | `/home/notifications` | User notifications | - |
| `pages/customer/about.tsx` | `/about` | About page | - |
| `pages/customer/contact.tsx` | `/contact` | Contact page | `card`, `input`, `textarea`, `label`, `button` |

### Admin Pages (Route: `/admin/*`)
| File | Route | Purpose | UI Components Used |
|------|-------|---------|-------------------|
| `pages/dashboard.tsx` | `/admin` | Admin dashboard with charts & metrics | `card`, `button` |
| `pages/products.tsx` | `/admin/products` | Product CRUD: add/edit/delete, sizes, colors, pricing, bulk CSV upload | `card`, `input`, `button`, `badge`, `dialog`, `label`, `select`, `textarea`, `separator` |
| `pages/inventory.tsx` | `/admin/inventory` | Inventory management | - |
| `pages/discounts.tsx` | `/admin/discounts` | Discount management: coupons, flash sales, BOGO, loyalty | `card`, `input`, `button`, `badge`, `dialog`, `label`, `select`, `separator` |
| `pages/customers.tsx` | `/admin/customers` | Customer management & segmentation | `card`, `button`, `badge`, `dialog`, `label`, `input`, `select`, `textarea` |
| `pages/delivery.tsx` | `/admin/delivery` | Delivery management with GPS tracking, courier assignment | `card`, `input`, `button`, `badge`, `dialog`, `label`, `select`, `separator` + `map-wrapper` |
| `pages/admin-settings.tsx` | `/admin/settings` | Admin profile, security, password, notifications | `card`, `input`, `button`, `label`, `tabs`, `avatar`, `separator` |
| `pages/ordering-form.tsx` | ❌ NOT IN ROUTES | Unused legacy form | - |

### Reports
- **`pages/dashboard.tsx`** is also used for `/admin/reports` route

---

## 🎨 UI Components (Actively Used)

Located in: `src/app/components/ui/`

### ✅ **USED Components** (Keep these)
| Component | Used By | Purpose |
|-----------|---------|---------|
| `alert.tsx` | `landing.tsx` | Alert messages |
| `avatar.tsx` | `user-dashboard.tsx`, `admin-settings.tsx` | User profile pictures |
| `badge.tsx` | `customer-layout.tsx`, `user-dashboard.tsx`, all admin pages | Status badges, counts |
| `button.tsx` | All pages | Primary UI interaction |
| `card.tsx` | Most pages | Content containers |
| `dialog.tsx` | `products.tsx`, `discounts.tsx`, `customers.tsx`, `delivery.tsx` | Modal dialogs |
| `dropdown-menu.tsx` | `customer-layout.tsx` | User menu dropdown |
| `input.tsx` | All forms | Text inputs |
| `label.tsx` | All forms | Form labels |
| `radio-group.tsx` | `checkout.tsx` | Payment/shipping options |
| `select.tsx` | `products.tsx`, `discounts.tsx`, `delivery.tsx`, `customers.tsx` | Dropdown selects |
| `separator.tsx` | Multiple pages | Visual dividers |
| `tabs.tsx` | `unified-login.tsx`, `user-dashboard.tsx`, `admin-settings.tsx` | Tabbed interfaces |
| `textarea.tsx` | `contact.tsx`, `products.tsx`, `customers.tsx` | Multi-line text input |

### ❌ **UNUSED Components** (Can be removed to clean up)
These components exist but are not imported anywhere in the application:

- `accordion.tsx`
- `alert-dialog.tsx`
- `aspect-ratio.tsx`
- `breadcrumb.tsx`
- `calendar.tsx`
- `carousel.tsx`
- `chart.tsx` - Note: Using Recharts directly, not this wrapper
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `drawer.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input-otp.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `progress.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx` - Note: Using `sonner` directly via `import { toast } from 'sonner'`
- `switch.tsx`
- `table.tsx`
- `toggle.tsx`
- `toggle-group.tsx`
- `tooltip.tsx`

---

## 📦 Key Dependencies

### NPM Packages Used
- **React Router** (`react-router`) - v7, routing
- **Leaflet** - GPS map rendering (vanilla JS, not react-leaflet)
- **Recharts** - Charts in dashboard
- **Radix UI** - Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS v4** - Styling
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Data Storage
- **localStorage** - All data persistence (no backend)
  - User auth: `userAuth`, `userName`
  - Admin auth: `adminAuth`, `adminUser`
  - Products, orders, customers, discounts, etc.

---

## 🎯 Feature Summary

### Customer Features
1. ✅ Product browsing and search
2. ✅ Shopping cart & checkout
3. ✅ User registration & login
4. ✅ Order tracking with GPS map
5. ✅ Wishlist
6. ✅ User dashboard (profile, orders, addresses, notifications)
7. ✅ Reviews

### Admin Features
1. ✅ Dashboard with analytics
2. ✅ Product management (CRUD, variants, bulk upload)
3. ✅ Inventory management
4. ✅ Discount management (coupons, flash sales, BOGO, loyalty)
5. ✅ Customer management
6. ✅ Delivery management with GPS tracking
7. ✅ Courier assignment
8. ✅ Reports
9. ✅ Admin settings (profile, security, password, notifications)
10. ✅ Logout functionality

---

## 🔐 Authentication

### Admin Login
- Email: `admin@highdensity.com`
- Password: `Admin123`
- Routes: `/admin/*`

### Customer Login
- Registration required at `/register`
- Auto-login after registration
- Routes: `/home/*`

---

## 🗺️ GPS Tracking System

### Implementation
- Uses vanilla **Leaflet** (not react-leaflet due to context issues)
- Custom `MapWrapper` component
- Mock GPS coordinates with auto-refresh

### Where Used
1. **Customer** - `/home/track-order` - Track own order with rider location
2. **Admin** - `/admin/delivery` - Monitor all active deliveries with GPS feed

### Delivery Status Workflow
1. Order Placed
2. Processing
3. Out for Delivery
4. Delivered

---

## 🎨 Design Theme

### Admin Panel
- Colors: Gray/Black/White professional theme
- Sidebar: Collapsible (w-20 collapsed, w-64 expanded)
- Background: `bg-gray-900` sidebar, `bg-white` content

### Customer Interface
- Colors: Brown/Tan theme (`#B7885E`, `#3B2C24`, `#8B7355`)
- Background: Light cream/beige tones
- Professional clothing retail aesthetic

---

## 📋 Next Steps / Potential Improvements

If you want to extend the system, consider:
1. Connect to real backend API (currently all localStorage)
2. Real GPS integration (currently mock data)
3. Payment gateway integration (Stripe, PayPal)
4. Email notifications (SendGrid, etc.)
5. Image upload to cloud storage (Cloudinary, AWS S3)
6. Search functionality in catalog
7. Product filtering by category, price, etc.
8. Customer reviews implementation
9. Analytics dashboard with real data
10. Export reports (PDF, Excel)

---

## 🧹 Cleanup Recommendations

### Safe to Delete (32 unused UI components)
Run this to remove unused components:
```bash
cd src/app/components/ui
rm accordion.tsx alert-dialog.tsx aspect-ratio.tsx breadcrumb.tsx calendar.tsx carousel.tsx chart.tsx checkbox.tsx collapsible.tsx command.tsx context-menu.tsx drawer.tsx form.tsx hover-card.tsx input-otp.tsx menubar.tsx navigation-menu.tsx pagination.tsx popover.tsx progress.tsx resizable.tsx scroll-area.tsx sheet.tsx sidebar.tsx skeleton.tsx slider.tsx sonner.tsx switch.tsx table.tsx toggle.tsx toggle-group.tsx tooltip.tsx
```

### Files to Keep
- All page files (except `ordering-form.tsx` if truly unused)
- All used UI components (15 components)
- Layout components
- `map-wrapper.tsx`
- `ImageWithFallback.tsx`

---

**Last Updated:** April 20, 2026
**Project Status:** ✅ Fully Functional
