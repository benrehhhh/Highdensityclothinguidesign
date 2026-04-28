import { apiGet, apiSend } from "./api";

export const adminApi = {
  getDashboardSummary: () => apiGet<{ ordersToday: number; pendingDeliveries: number; lowStockAlerts: number; monthlySales: number }>("/admin/dashboard/summary"),
  getOrders: () => apiGet<any[]>("/admin/orders"),
  getProducts: () => apiGet<any[]>("/admin/products"),
  createProduct: (payload: any) => apiSend("/admin/products", "POST", payload),
  updateProduct: (id: string | number, payload: any) => apiSend(`/admin/products/${id}`, "PUT", payload),
  deleteProduct: (id: string | number) => apiSend(`/admin/products/${id}`, "DELETE"),
  getInventory: () => apiGet<any[]>("/admin/inventory"),
  updateInventory: (id: string | number, stock: number) => apiSend(`/admin/inventory/${id}`, "PATCH", { stock }),
  getCustomers: () => apiGet<any[]>("/admin/customers"),
  updateCustomer: (id: string | number, payload: any) => apiSend(`/admin/customers/${id}`, "PATCH", payload),
  getDiscounts: () => apiGet<any[]>("/admin/discounts"),
  createDiscount: (payload: any) => apiSend("/admin/discounts", "POST", payload),
  updateDiscount: (id: string | number, payload: any) => apiSend(`/admin/discounts/${id}`, "PUT", payload),
  deleteDiscount: (id: string | number) => apiSend(`/admin/discounts/${id}`, "DELETE"),
  getDelivery: () => apiGet<any[]>("/admin/delivery"),
  updateDeliveryStatus: (id: string | number, status: string) => apiSend(`/admin/delivery/${id}/status`, "PATCH", { status }),
  updateDelivery: (id: string | number, payload: any) => apiSend(`/admin/delivery/${id}`, "PATCH", payload),
  getReportOverview: () => apiGet<any>("/admin/reports/overview")
};
