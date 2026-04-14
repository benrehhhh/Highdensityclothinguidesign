import { useState } from 'react';
import { User, ShoppingBag, Heart, MapPin, Bell, Edit, Camera, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Link } from 'react-router';

const userOrders = [
  {
    id: 'ORD-001',
    date: '2024-03-15',
    status: 'Delivered',
    total: 2598,
    items: 2
  },
  {
    id: 'ORD-002',
    date: '2024-03-10',
    status: 'In Transit',
    total: 1599,
    items: 1
  },
  {
    id: 'ORD-003',
    date: '2024-03-05',
    status: 'Processing',
    total: 4297,
    items: 3
  }
];

const savedAddresses = [
  {
    id: 1,
    label: 'Home',
    name: 'Juan Dela Cruz',
    address: '123 Main Street, Barangay Santo Niño',
    city: 'Quezon City',
    province: 'Metro Manila',
    postal: '1100',
    phone: '0917 123 4567',
    isDefault: true
  },
  {
    id: 2,
    label: 'Work',
    name: 'Juan Dela Cruz',
    address: '456 Business Ave, BGC',
    city: 'Taguig City',
    province: 'Metro Manila',
    postal: '1630',
    phone: '0917 123 4567',
    isDefault: false
  }
];

const notifications = [
  {
    id: 1,
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order ORD-001 has been delivered',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    type: 'promo',
    title: 'New Promotion',
    message: '20% off on all items this weekend!',
    time: '1 day ago',
    read: false
  },
  {
    id: 3,
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order ORD-002 is on the way',
    time: '2 days ago',
    read: true
  }
];

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const user = {
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '0917 123 4567',
    initials: 'JD'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">My Account</h1>
          <p className="text-[#8B7355]">Manage your profile and orders</p>
        </div>

        {/* Profile Card */}
        <Card className="border-[#B7885E]/20 shadow-lg bg-white mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 bg-[#B7885E] text-white">
                  <AvatarFallback className="bg-[#B7885E] text-white text-2xl">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#DDB67D] hover:bg-[#B7885E] text-white"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#3B2C24]">{user.name}</h3>
                <p className="text-[#8B7355]">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#8B7355]">Member since</p>
                <p className="font-medium text-[#3B2C24]">March 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-white border border-[#B7885E]/20 mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#B7885E] data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#B7885E] data-[state=active]:text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-[#B7885E] data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-[#B7885E] data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#B7885E] data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-[#B7885E]/20 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-[#3B2C24]">Edit Profile</CardTitle>
                <CardDescription className="text-[#8B7355]">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#3B2C24]">First Name</Label>
                    <Input defaultValue="Juan" className="border-[#B7885E]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#3B2C24]">Last Name</Label>
                    <Input defaultValue="Dela Cruz" className="border-[#B7885E]/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Email Address</Label>
                  <Input type="email" defaultValue={user.email} className="border-[#B7885E]/20" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Phone Number</Label>
                  <Input type="tel" defaultValue={user.phone} className="border-[#B7885E]/20" />
                </div>

                <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-[#B7885E]/20 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-[#3B2C24]">Order History</CardTitle>
                <CardDescription className="text-[#8B7355]">
                  View and track your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-[#B7885E]/20 rounded-lg hover:bg-[#FFF5E6]/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FFF5E6] rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#B7885E]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#3B2C24]">{order.id}</p>
                          <p className="text-sm text-[#8B7355]">{order.date} • {order.items} items</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-sm font-semibold text-[#B7885E] mt-1">
                            ₱{order.total.toLocaleString()}
                          </p>
                        </div>
                        <Link to="/home/track-order">
                          <Button variant="outline" size="sm" className="border-[#B7885E]/20">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="border-[#B7885E]/20 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-[#3B2C24]">My Wishlist</CardTitle>
                <CardDescription className="text-[#8B7355]">
                  Items you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-[#B7885E] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-[#3B2C24] mb-2">Your wishlist is empty</h3>
                  <p className="text-[#8B7355] mb-6">Start adding items you love!</p>
                  <Link to="/home/catalog">
                    <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              {savedAddresses.map((address) => (
                <Card key={address.id} className="border-[#B7885E]/20 shadow-lg bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-[#3B2C24]">{address.label}</h3>
                          {address.isDefault && (
                            <Badge className="bg-[#B7885E] text-white hover:bg-[#B7885E]">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-[#3B2C24] mb-1">{address.name}</p>
                        <p className="text-[#8B7355] text-sm mb-1">{address.address}</p>
                        <p className="text-[#8B7355] text-sm mb-1">
                          {address.city}, {address.province} {address.postal}
                        </p>
                        <p className="text-[#8B7355] text-sm">{address.phone}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#B7885E]">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full border-[#B7885E]/20 text-[#3B2C24]">
                <MapPin className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-[#B7885E]/20 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-[#3B2C24]">Notifications</CardTitle>
                <CardDescription className="text-[#8B7355]">
                  Stay updated with your orders and promotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border border-[#B7885E]/20 rounded-lg ${
                        !notification.read ? 'bg-[#FFF5E6]/50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#3B2C24]">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#B7885E] rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-[#8B7355] mb-2">{notification.message}</p>
                          <p className="text-xs text-[#8B7355]">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
