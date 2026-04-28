import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { BarChart3, FileText, TrendingUp, Truck } from "lucide-react";
import { adminApi } from "../../lib/admin-api";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function Reports() {
  const [report, setReport] = useState<any>({
    kpis: { revenue: 0, orders: 0, delivered: 0, processing: 0 },
    monthly: [],
    topProducts: []
  });

  useEffect(() => {
    adminApi.getReportOverview().then(setReport).catch(() => undefined);
  }, []);

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Live business reports and operational analytics.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5" />
              Revenue
            </CardTitle>
            <CardDescription>Total recorded revenue</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-[#B7885E]">
            ₱{Number(report.kpis.revenue).toLocaleString()}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Orders
            </CardTitle>
            <CardDescription>Total customer orders</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-gray-900">
            {report.kpis.orders}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Truck className="w-5 h-5" />
              Delivered
            </CardTitle>
            <CardDescription>Completed deliveries</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-green-600">
            {report.kpis.delivered}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5" />
              Processing
            </CardTitle>
            <CardDescription>Pending fulfillment workload</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-orange-600">
            {report.kpis.processing}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Monthly Sales Trend</CardTitle>
            <CardDescription>Sales totals by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#B7885E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Monthly Order Volume</CardTitle>
            <CardDescription>Orders processed by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3B2C24" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Top Products (by stock volume)</CardTitle>
          <CardDescription>Current high-volume products in inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Price</th>
                </tr>
              </thead>
              <tbody>
                {report.topProducts.map((product: any) => (
                  <tr key={product.name} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.stock}</td>
                    <td className="py-3 px-4 text-sm text-[#B7885E]">₱{Number(product.price).toLocaleString()}</td>
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
