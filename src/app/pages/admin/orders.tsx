import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { adminApi } from "../../lib/admin-api";

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    adminApi.getOrders().then(setOrders).catch(() => undefined);
  }, []);

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage all customer orders.</p>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Order List</CardTitle>
          <CardDescription className="text-gray-600">{orders.length} orders found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.items}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#B7885E]">₱{Number(order.total).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{order.status}</Badge>
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
