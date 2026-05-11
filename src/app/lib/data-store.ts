import { api } from "./api";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: string[];
  image: string;
  badge?: string;
  inStock: boolean;
  stock: number;
  description: string;
  materials?: string;
  care?: string;
  status?: 'Active' | 'Draft' | 'Out of Stock';
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
  items_count: number;
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

export function getProductById(id: number | string) {
  const idNum = typeof id === 'string' ? Number(id) : id;
  
  // First check the in-memory state
  const product = state.products.find((product) => product.id === idNum || product.id === id);
  if (product) return product;
  
  // If not found in state, try loading directly from localStorage
  try {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.find((p: any) => p.id === idNum || p.id === id);
  } catch (error) {
    console.error("Failed to get product from localStorage:", error);
    return undefined;
  }
}

export function getCart() {
  // Return state.cart if available, otherwise read from localStorage
  if (state.cart.length > 0) return state.cart;
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
  } catch (error) {
    console.error("Failed to get cart from localStorage:", error);
    return [];
  }
}

export function getWishlistProducts() {
  return state.wishlistProducts;
}

export function isWishlisted(productId: number) {
  return state.wishlistProducts.some((item) => item.id === productId);
}

export function getNotifications() {
  // Return state.notifications if available, otherwise read from localStorage
  if (state.notifications.length > 0) return state.notifications;
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications;
  } catch (error) {
    console.error("Failed to get notifications from localStorage:", error);
    return [];
  }
}

export function getOrders() {
  return JSON.parse(localStorage.getItem('userOrders') || '[]');
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
  try {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    state.products = products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
  emit();
}

export async function refreshCart() {
  try {
    // Only read from localStorage, never from API
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    state.cart = cart;
  } catch (error) {
    console.error("Failed to fetch cart from localStorage:", error);
    state.cart = [];
  }
  emit();
}

export async function refreshWishlist() {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    // Map wishlist product IDs to full product objects
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    state.wishlistProducts = wishlist
      .map((item: any) => products.find((p: any) => p.id === item.id))
      .filter((item: any) => item != null);
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
  }
  emit();
}

export async function refreshNotifications() {
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    state.notifications = notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
  emit();
}

export async function refreshOrders() {
  try {
    state.orders = await api.store.orders();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
  emit();
}

export async function toggleWishlist(productId: number) {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isWishlisted = wishlist.some((item: any) => item.id === productId);
    
    if (isWishlisted) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item: any) => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    } else {
      // Add to wishlist
      wishlist.push({ id: productId });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    
    await refreshWishlist();
  } catch (error) {
    console.error("Failed to toggle wishlist:", error);
  }
}

export async function addToCart(item: CartItem) {
  try {
    // Only use localStorage, don't call API
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((i: any) => i.productId === item.productId && i.size === item.size && i.color === item.color);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push({ ...item, id: Date.now() });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    state.cart = cart;
    emit();
  } catch (error) {
    console.error("Failed to add to cart:", error);
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  try {
    // Only use localStorage, don't call API
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find((i: any) => i.id === id);
    
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      state.cart = cart;
    }
    
    emit();
  } catch (error) {
    console.error("Failed to update cart quantity:", error);
  }
}

export async function removeCartItem(id: number) {
  try {
    // Only use localStorage, don't call API
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const filteredCart = cart.filter((i: any) => i.id !== id);
    
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    state.cart = filteredCart;
    emit();
  } catch (error) {
    console.error("Failed to remove cart item:", error);
  }
}

export async function markNotificationRead(id: number) {
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notificationIndex = notifications.findIndex(n => n.id === id);
    if (notificationIndex !== -1) {
      notifications[notificationIndex].read = true;
      localStorage.setItem('notifications', JSON.stringify(notifications));
      state.notifications = notifications;
    }
    emit();
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

export async function markAllNotificationsRead() {
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.forEach(n => n.read = true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    state.notifications = notifications;
    emit();
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}

