import { apiGet, apiSend } from "./api";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  colors: string[];
  image: string;
  badge?: string;
  inStock: boolean;
  stock?: number;
  description?: string;
};

export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
};

export type NotificationItem = {
  id: number;
  type: "order" | "promo" | "delivery" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export type UserOrder = {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Processing";
  total: number;
  items: number;
};

type StoreState = {
  products: Product[];
  cart: CartItem[];
  wishlistProducts: Product[];
  notifications: NotificationItem[];
  orders: UserOrder[];
};
const state: StoreState = {
  products: [],
  cart: [],
  wishlistProducts: [],
  notifications: [],
  orders: []
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProducts() {
  return state.products;
}

export function getProductById(id: number) {
  return state.products.find((product) => product.id === id);
}

export function getCart() {
  return state.cart;
}

export function getWishlistProducts() {
  return state.wishlistProducts;
}

export function isWishlisted(productId: number) {
  return state.wishlistProducts.some((item) => item.id === productId);
}

export function getNotifications() {
  return state.notifications;
}

export function getOrders() {
  return state.orders;
}

export function getHeaderCounts() {
  return {
    cart: state.cart.reduce((acc, item) => acc + item.quantity, 0),
    wishlist: state.wishlistProducts.length,
    notifications: state.notifications.filter((n) => !n.read).length
  };
}

export async function initStore() {
  await Promise.all([
    refreshProducts(),
    refreshCart(),
    refreshWishlist(),
    refreshNotifications(),
    refreshOrders()
  ]);
  emit();
}

export async function refreshProducts() {
  state.products = await apiGet<Product[]>("/products");
  emit();
}

export async function refreshCart() {
  state.cart = await apiGet<CartItem[]>("/me/cart");
  emit();
}

export async function refreshWishlist() {
  state.wishlistProducts = await apiGet<Product[]>("/me/wishlist");
  emit();
}

export async function refreshNotifications() {
  state.notifications = await apiGet<NotificationItem[]>("/me/notifications");
  emit();
}

export async function refreshOrders() {
  state.orders = await apiGet<UserOrder[]>("/me/orders");
  emit();
}

export async function toggleWishlist(productId: number) {
  if (isWishlisted(productId)) {
    await apiSend(`/me/wishlist/${productId}`, "DELETE");
  } else {
    await apiSend(`/me/wishlist/${productId}`, "POST");
  }
  await refreshWishlist();
}

export async function addToCart(item: Omit<CartItem, "id">) {
  await apiSend("/me/cart/items", "POST", item);
  await refreshCart();
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  await apiSend(`/me/cart/items/${id}`, "PATCH", { quantity });
  await refreshCart();
}

export async function removeCartItem(id: number) {
  await apiSend(`/me/cart/items/${id}`, "DELETE");
  await refreshCart();
}

export async function markNotificationRead(id: number) {
  await apiSend(`/me/notifications/${id}/read`, "PATCH");
  await refreshNotifications();
}

export async function markAllNotificationsRead() {
  await apiSend("/me/notifications/read-all", "PATCH");
  await refreshNotifications();
}
