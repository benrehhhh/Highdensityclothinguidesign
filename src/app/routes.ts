import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/dashboard";
import { Inventory } from "./pages/inventory";
import { Customers } from "./pages/customers";
import { Delivery } from "./pages/delivery";
import { Products } from "./pages/products";
import { Discounts } from "./pages/discounts";
import { AdminSettings } from "./pages/admin-settings";
import { AdminLayout } from "./components/admin-layout";
import { CustomerLayout } from "./components/customer-layout";
import { Homepage } from "./pages/customer/homepage";
import { Catalog } from "./pages/customer/catalog";
import { ProductDetails } from "./pages/customer/product-details";
import { Cart } from "./pages/customer/cart";
import { Checkout } from "./pages/customer/checkout";
import { UserDashboard } from "./pages/customer/user-dashboard";
import { OrderTracking } from "./pages/customer/order-tracking";
import { Wishlist } from "./pages/customer/wishlist";
import { Reviews } from "./pages/customer/reviews";
import { Notifications } from "./pages/customer/notifications";
import { Landing } from "./pages/landing";
import { UnifiedLogin } from "./pages/unified-login";
import { Register } from "./pages/auth/register";
import { About } from "./pages/customer/about";
import { Contact } from "./pages/customer/contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: UnifiedLogin,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/home",
    Component: CustomerLayout,
    children: [
      { index: true, Component: Homepage },
      { path: "catalog", Component: Catalog },
      { path: "product/:id", Component: ProductDetails },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "account", Component: UserDashboard },
      { path: "track-order", Component: OrderTracking },
      { path: "wishlist", Component: Wishlist },
      { path: "reviews", Component: Reviews },
      { path: "notifications", Component: Notifications },
    ],
  },
  {
    path: "/about",
    Component: CustomerLayout,
    children: [
      { index: true, Component: About },
    ],
  },
  {
    path: "/contact",
    Component: CustomerLayout,
    children: [
      { index: true, Component: Contact },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "products", Component: Products },
      { path: "inventory", Component: Inventory },
      { path: "discounts", Component: Discounts },
      { path: "customers", Component: Customers },
      { path: "delivery", Component: Delivery },
      { path: "reports", Component: Dashboard },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);