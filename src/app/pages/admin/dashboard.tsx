import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  DollarSign,
  Package,
  Users,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';
import { adminApi } from '../../lib/admin-api';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const salesData = [
  { id: 'jan', month: 'Jan', sales: 45000, orders: 85 },
  { id: 'feb', month: 'Feb', sales: 52000, orders: 98 },
  { id: 'mar', month: 'Mar', sales: 48000, orders: 90 },
  { id: 'apr', month: 'Apr', sales: 61000, orders: 115 },
  { id: 'may', month: 'May', sales: 55000, orders: 105 },
  { id: 'jun', month: 'Jun', sales: 67000, orders: 128 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Maria Santos', product: 'Cotton Shirt', amount: 1299, status: 'Processing' },
  { id: 'ORD-002', customer: 'Juan Cruz', product: 'Linen Polo', amount: 1599, status: 'Shipped' },
  { id: 'ORD-003', customer: 'Ana Reyes', product: 'Cotton Shirt', amount: 1299, status: 'Pending' },
  { id: 'ORD-004', customer: 'Pedro Garcia', product: 'Premium Jacket', amount: 2499, status: 'Processing' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    ordersToday: 0,
    pendingDeliveries: 0,
    lowStockAlerts: 0,
    monthlySales: 0
  });
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    adminApi.getDashboardSummary().then(setSummary).catch(() => undefined);
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gradient-to-b from-[#f8f5f2] to-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#B7885E]/20 p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {today}
          </p>
        </div>
        <div className="flex gap-3">
          
          
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-[#B7885E]/20 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Total Orders Today
            </CardTitle>
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{summary.ordersToday}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Pending Deliveries
            </CardTitle>
            <Package className="w-5 h-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{summary.pendingDeliveries}</div>
            <p className="text-xs text-gray-600 mt-2">
              3 dispatched today
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-sm hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Low Stock Alerts
            </CardTitle>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{summary.lowStockAlerts}</div>
            <p className="text-xs text-red-600 mt-2">
              Needs restocking
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-sm hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Monthly Sales
            </CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">₱{summary.monthlySales.toLocaleString()}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              <span className="text-green-600">+22%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-[#B7885E]" />
              Sales Trend
            </CardTitle>
            <CardDescription className="text-gray-600">
              Monthly sales performance for the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData} key="sales-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#B7885E20" key="grid-sales" />
                <XAxis
                  dataKey="month"
                  stroke="#8B7355"
                  style={{ fontSize: '12px' }}
                  key="xaxis-sales"
                />
                <YAxis
                  stroke="#8B7355"
                  style={{ fontSize: '12px' }}
                  key="yaxis-sales"
                />
                <Tooltip
                  key="tooltip-sales"
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #B7885E40',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  key="line-sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#B7885E"
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                  name="Sales"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <ShoppingCart className="w-5 h-5 text-[#B7885E]" />
              Order Volume
            </CardTitle>
            <CardDescription className="text-gray-600">
              Number of orders per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData} key="orders-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#B7885E20" key="grid-orders" />
                <XAxis
                  dataKey="month"
                  stroke="#8B7355"
                  style={{ fontSize: '12px' }}
                  key="xaxis-orders"
                />
                <YAxis
                  stroke="#8B7355"
                  style={{ fontSize: '12px' }}
                  key="yaxis-orders"
                />
                <Tooltip
                  key="tooltip-orders"
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #B7885E40',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  key="bar-orders"
                  dataKey="orders"
                  fill="#B7885E"
                  radius={[8, 8, 0, 0]}
                  name="Orders"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <ShoppingCart className="w-5 h-5 text-[#B7885E]" />
            Recent Orders
          </CardTitle>
          <CardDescription className="text-gray-600">
            Latest customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#B7885E]/10 hover:bg-[#FFF5E6]/50">
                    <td className="py-3 px-4 text-sm text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.product}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#B7885E]">₱{order.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className="border-gray-200 bg-gradient-to-br from-[#B7885E] to-[#9d7350] text-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/products")}
        >
          <CardContent className="pt-6">
            <Package className="w-10 h-10 mb-3 opacity-90" />
            <h3 className="font-semibold text-lg mb-1">Add Product</h3>
            <p className="text-sm text-white/80">Add new items to inventory</p>
          </CardContent>
        </Card>

        <Card
          className="border-gray-200 bg-gradient-to-br from-[#DDB67D] to-[#B7885E] text-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/orders")}
        >
          <CardContent className="pt-6">
            <ShoppingCart className="w-10 h-10 mb-3 opacity-90" />
            <h3 className="font-semibold text-lg mb-1">View Orders</h3>
            <p className="text-sm text-white/80">Manage customer orders</p>
          </CardContent>
        </Card>

        <Card
          className="border-gray-200 bg-gradient-to-br from-[#3B2C24] to-[#4a3a30] text-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/admin/delivery")}
        >
          <CardContent className="pt-6">
            <Users className="w-10 h-10 mb-3 opacity-90" />
            <h3 className="font-semibold text-lg mb-1">Process Delivery</h3>
            <p className="text-sm text-white/80">Update delivery status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
