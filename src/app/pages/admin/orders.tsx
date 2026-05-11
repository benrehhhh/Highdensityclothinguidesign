import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { adminApi } from "../../lib/admin-api";
import { toast } from "sonner";

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">Review and update customer orders.</p>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">All Orders</CardTitle>
          <CardDescription>{orders.length} orders found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-900">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium text-[#B7885E]">₱{Number(order.total).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={
                        order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 
                        order.status === 'Processing' ? 'bg-yellow-50 text-yellow-700' : ''
                      }>{order.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Select value={order.status} onValueChange={(v) => handleUpdateStatus(order.id, v)}>
                        <SelectTrigger className="w-[140px] ml-auto"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
