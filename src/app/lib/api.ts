const API_BASE = "http://localhost:4001/api";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`GET ${path} failed`);
  }
  return response.json() as Promise<T>;
}

export async function apiSend<T>(path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    throw new Error(`${method} ${path} failed`);
  }
  return response.json() as Promise<T>;
}

// Real API for High Density Clothing

export const api = {
  store: {
    getProfile: async () => {
      return apiGet<any>("/me/profile");
    },
    updateProfile: async (payload: any) => {
      return apiSend<any>("/me/profile", "PUT", payload);
    },
    cart: async () => {
      return apiGet<any[]>("/me/cart");
    },
    addToCart: async (item: any) => {
      return apiSend<any>("/me/cart/items", "POST", item);
    },
    updateCartItem: async (id: number, quantity: number) => {
      return apiSend<any>(`/me/cart/items/${id}`, "PATCH", { quantity });
    },
    removeCartItem: async (id: number) => {
      return apiSend<any>(`/me/cart/${id}`, "DELETE");
    },
    markNotificationRead: async (id: number) => {
      return apiSend<any>(`/me/notifications/${id}`, "PATCH", { read: true });
    },
    markAllNotificationsRead: async () => {
      return apiSend<any>("/me/notifications/read-all", "POST");
    },
    wishlist: async () => {
      return apiGet<any[]>("/me/wishlist");
    },
    toggleWishlist: async (productId: number, isWishlisted: boolean) => {
      if (isWishlisted) {
        return apiSend<any>(`/me/wishlist/${productId}`, "DELETE");
      }
      return apiSend<any>("/me/wishlist", "POST", { productId });
    },
    notifications: async () => {
      return apiGet<any[]>("/me/notifications");
    },
    orders: async () => {
      return apiGet<any[]>("/me/orders");
    },
    createOrder: async (payload: any) => {
      return apiSend<any>("/me/orders", "POST", payload);
    }
  },
  admin: {
    reports: async (range: string) => {
      return apiGet<any>(`/admin/reports?range=${range}`);
    }
  }
};

