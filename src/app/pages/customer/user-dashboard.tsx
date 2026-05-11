import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, MapPin, Bell, Edit, Camera, Package, ShoppingCart, X, Star, Navigation, MessageSquare, Gift, Truck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { getNotifications, getOrders, getWishlistProducts, initStore, subscribeStore, toggleWishlist } from '../../lib/data-store';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

export function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(localStorage.getItem("userProfileImage"));
  const [userOrders, setUserOrders] = useState(getOrders());
  const [orderSort, setOrderSort] = useState<'newest' | 'oldest'>('newest');
  const [notifications, setNotifications] = useState(getNotifications());
  const [notificationFilter, setNotificationFilter] = useState<'all' | string>('all');
  const filteredNotifications = notificationFilter === 'all' 
    ? notifications 
    : notifications.filter((n: any) => n.type === notificationFilter);
  const [wishlistItems, setWishlistItems] = useState(getWishlistProducts());
  const [profile, setProfile] = useState<any>({ name: '', email: '', phone: '', address: '' });
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    commentary: ''
  });
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    name: '',
    address: '',
    city: '',
    province: '',
    postal: '',
    phone: ''
  });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    initStore().catch(() => undefined);
    
    // Subscribe to store changes
    subscribeStore(() => {
      setUserOrders(getOrders());
      setNotifications(getNotifications());
      setWishlistItems(getWishlistProducts());
    });
  }, []);
  
  useEffect(() => {
    // Load profile from localStorage
    const profileData = {
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      phone: localStorage.getItem('userPhone') || '',
      address: localStorage.getItem('userAddress') || ''
    };
    setProfile(profileData);
    
    // Load orders and notifications from localStorage
    const storedOrders = localStorage.getItem('userOrders');
    const storedNotifications = localStorage.getItem('notifications');
    setUserOrders(storedOrders ? JSON.parse(storedOrders) : getOrders());
    setNotifications(storedNotifications ? JSON.parse(storedNotifications) : getNotifications());

    // Load saved addresses from localStorage
    const storedAddresses = localStorage.getItem('savedAddresses');
    setSavedAddresses(storedAddresses ? JSON.parse(storedAddresses) : []);

    // Check for review notifications for delivered orders
    checkForReviewNotifications();
  }, []);

  useEffect(() => {
    // Listen for localStorage changes for real-time notifications
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userOrders') {
        // Order status changed - reload orders and check for status changes
        const newOrders = JSON.parse(e.newValue || '[]');
        const oldOrders = userOrders;
        
        // Check for status changes
        newOrders.forEach((newOrder: any) => {
          const oldOrder = oldOrders.find((o: any) => o.id === newOrder.id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            // Status changed, create notification
            const notification = {
              id: Date.now(),
              title: `Order #${newOrder.id} Status Updated`,
              message: `Your order status has changed from "${oldOrder.status}" to "${newOrder.status}"`,
              time: new Date().toISOString(),
              read: false
            };
            addNotification(notification);
          }
        });

        setUserOrders(newOrders);
      } else if (e.key === 'productReviews') {
        // Reviews added - check if we need to remove review notifications
        checkForReviewNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userOrders]);

  const handleSaveAddress = () => {
    if (!newAddress.label || !newAddress.name || !newAddress.address || !newAddress.city || !newAddress.province || !newAddress.postal || !newAddress.phone) {
      toast.error('Please fill in all address fields');
      return;
    }

    const addressToAdd = {
      id: Date.now(),
      ...newAddress,
      isDefault: savedAddresses.length === 0
    };

    const updatedAddresses = [...savedAddresses, addressToAdd];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));

    toast.success('Address saved successfully!');
    setIsAddAddressDialogOpen(false);
    setNewAddress({
      label: '',
      name: '',
      address: '',
      city: '',
      province: '',
      postal: '',
      phone: ''
    });
  };

  const handleDeleteAddress = (id: number) => {
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== id);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    toast.success('Address deleted successfully');
  };

  const handleSetDefaultAddress = (id: number) => {
    const updatedAddresses = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    toast.success('Default address updated');
  };

  const addNotification = (notification: any) => {
    const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = [notification, ...currentNotifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    toast.success(notification.title);
  };

  const checkForReviewNotifications = () => {
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const productReviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
    const currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');

    // Check for delivered orders without reviews
    userOrders.forEach((order: any) => {
      if (order.status === 'Delivered' && order.items) {
        order.items.forEach((item: any) => {
          const productId = item.productId || item.product_id;
          const hasReviewed = productReviews[productId] && 
            productReviews[productId].some((review: any) => review.orderId === order.id);
          
          if (!hasReviewed) {
            // Check if notification already exists for this order-item combination
            const notificationExists = currentNotifications.some((n: any) => 
              n.title.includes(`Review Your Order #${order.id}`) && 
              n.message.includes(item.name)
            );
            
            if (!notificationExists) {
              const notification = {
                id: Date.now() + Math.random(),
                title: `Review Your Order #${order.id}`,
                message: `Please share your thoughts about "${item.name}"`,
                time: new Date().toISOString(),
                read: false,
                orderId: order.id,
                productId: productId,
                productName: item.name
              };
              addNotification(notification);
            }
          }
        });
      }
    });
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    const updatedNotifications = notifications.map((n: any) => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Navigate based on notification type
    if (notification.title.includes('Status Updated')) {
      const orderId = notification.title.match(/Order #(\d+)/)?.[1];
      if (orderId) {
        navigate(`/home/track-order?orderId=${orderId}`);
      }
    } else if (notification.title.includes('Review Your Order')) {
      // Navigate to orders tab and open review dialog
      setActiveTab('orders');
      const order = userOrders.find((o: any) => o.id === notification.orderId);
      if (order && notification.productId) {
        const product = order.items?.find((item: any) => 
          (item.productId || item.product_id) === notification.productId
        );
        if (product) {
          handleOpenReview(order, product);
        }
      }
    }
  };

  const initials = (profile.name || 'User').split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const handleTrackOrder = (order: any) => {
    // Navigate to order tracking page with order ID
    navigate(`/home/track-order?orderId=${order.id}`);
  };

  const handleOpenReview = (order: any, product: any) => {
    setSelectedOrder(order);
    setSelectedProduct(product);
    setReviewData({ rating: 0, commentary: '' });
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedProduct || reviewData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Get existing reviews from localStorage
    const productReviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
    
    // Add new review
    const newReview = {
      id: Date.now(),
      productId: selectedProduct.productId || selectedProduct.product_id,
      productName: selectedProduct.name,
      rating: reviewData.rating,
      commentary: reviewData.commentary,
      userName: profile.name || 'Anonymous',
      date: new Date().toISOString(),
      orderId: selectedOrder.id
    };

    // Store reviews by product ID
    const productId = selectedProduct.productId || selectedProduct.product_id;
    if (!productReviews[productId]) {
      productReviews[productId] = [];
    }
    productReviews[productId].push(newReview);
    
    localStorage.setItem('productReviews', JSON.stringify(productReviews));
    
    toast.success('Review submitted successfully!');
    setIsReviewDialogOpen(false);
    setReviewData({ rating: 0, commentary: '' });
    setSelectedOrder(null);
    setSelectedProduct(null);
  };

  const handleUpdateProfile = async () => {
    try {
      // Save profile data to localStorage
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userEmail', profile.email);
      localStorage.setItem('userPhone', profile.phone);
      
      // Update registered users data if exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((u: any) => u.email === profile.email);
      if (userIndex !== -1) {
        registeredUsers[userIndex] = {
          ...registeredUsers[userIndex],
          fullName: profile.name,
          email: profile.email,
          phone: profile.phone
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
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
                  {profileImage ? <img src={profileImage} alt={profile.name} className="w-full h-full object-cover" /> : null}
                  <AvatarFallback className="bg-[#B7885E] text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#DDB67D] hover:bg-[#B7885E] text-white"
                  onClick={() => document.getElementById("user-profile-upload")?.click()}
                >
                  <Camera className="w-3 h-3" />
                </Button>
                <input
                  id="user-profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result as string;
                      setProfileImage(dataUrl);
                      localStorage.setItem("userProfileImage", dataUrl);
                      toast.success("Profile image updated");
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#3B2C24]">{profile.name}</h3>
                <p className="text-[#8B7355]">{profile.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#8B7355]">Member since</p>
                <p className="font-medium text-[#3B2C24]">
                  {profile.joined ? new Date(profile.joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
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
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Full Name</Label>
                  <Input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="border-[#B7885E]/20" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Email Address</Label>
                  <Input 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="border-[#B7885E]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Phone Number</Label>
                  <Input 
                    type="tel" 
                    value={profile.phone || ''} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="border-[#B7885E]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Address</Label>
                  <Input 
                    type="text" 
                    value={profile.address || ''} 
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="border-[#B7885E]/20"
                  />
                </div>

                <Button 
                  className="bg-[#B7885E] hover:bg-[#9d7350] text-white"
                  onClick={handleUpdateProfile}
                >
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Button
                      variant={orderSort === 'newest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOrderSort('newest')}
                      className={orderSort === 'newest' ? 'bg-[#B7885E] text-white' : ''}
                    >
                      Newest
                    </Button>
                    <Button
                      variant={orderSort === 'oldest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOrderSort('oldest')}
                      className={orderSort === 'oldest' ? 'bg-[#B7885E] text-white' : ''}
                    >
                      Oldest
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  {[...userOrders].sort((a: any, b: any) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return orderSort === 'newest' ? dateB - dateA : dateA - dateB;
                  }).map((order: any) => (
                    <div
                      key={order.id}
                      className="border border-[#B7885E]/20 rounded-lg hover:bg-[#FFF5E6]/50 transition-colors"
                    >
                      <div className="p-4 border-b border-[#B7885E]/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#FFF5E6] rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-[#B7885E]" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#3B2C24]">#{order.id}</p>
                              <p className="text-sm text-[#8B7355]">{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <p className="text-sm font-semibold text-[#B7885E] mt-1">
                                ₱{(order.total ?? 0).toLocaleString()}
                              </p>
                            </div>
                            {(order.status === 'Processing' || order.status === 'Out for Delivery') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTrackOrder(order)}
                                className="border-[#B7885E] text-[#B7885E] hover:bg-[#B7885E] hover:text-white"
                              >
                                <Navigation className="w-4 h-4 mr-2" />
                                Track Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-sm font-medium text-[#3B2C24] mb-3">Items in this order:</p>
                        <div className="space-y-2">
                          {order.items && order.items.map((item: any, index: number) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between text-sm cursor-pointer hover:bg-[#FFF5E6] p-2 rounded transition-colors"
                              onClick={() => {
                                const productId = item.product_id || item.productId;
                                if (productId) {
                                  navigate(`/home/product/${productId}`);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-[#f5ede0] rounded flex items-center justify-center">
                                    <Package className="w-5 h-5 text-[#B7885E]" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-[#3B2C24]">{item.name}</p>
                                  <p className="text-xs text-[#8B7355]">Qty: {item.quantity} • Size: {item.size} • Color: {item.color}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-[#B7885E]">₱{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</p>
                                {order.status === 'Delivered' && (() => {
                                  const productReviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
                                  const productId = item.product_id || item.productId;
                                  const reviews = productReviews[productId] || [];
                                  const hasReviewed = reviews.some((r: any) => r.orderId === order.id);
                                  
                                  if (hasReviewed) {
                                    return (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        className="border-green-500 text-green-600 bg-green-50"
                                      >
                                        <Star className="w-4 h-4 mr-2 fill-green-600" />
                                        Reviewed Successfully
                                      </Button>
                                    );
                                  }
                                  
                                  return (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenReview(order, item)}
                                      className="border-[#B7885E] text-[#B7885E] hover:bg-[#B7885E] hover:text-white"
                                    >
                                      <Star className="w-4 h-4 mr-2" />
                                      Review
                                    </Button>
                                  );
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
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
                  Items you've saved for later ({wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-[#B7885E] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-[#3B2C24] mb-2">Your wishlist is empty</h3>
                    <p className="text-[#8B7355] mb-6">Browse our products and add them to your wishlist!</p>
                    <Link to="/home/catalog">
                      <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item: any) => (
                      <Card key={item.id} className="border-[#B7885E]/20 hover:shadow-lg transition-shadow">
                        <div className="relative aspect-square overflow-hidden bg-[#f5ede0]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleWishlist(item.id).then(() => toast.success(`${item.name} removed from wishlist`))}
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {!item.inStock && item.inStock !== undefined && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive" className="text-white">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="pt-4">
                          <Link to={`/home/product/${item.id}`}>
                            <h3 className="font-semibold text-[#3B2C24] mb-2 hover:text-[#B7885E] transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-[#B7885E]">
                              ₱{(item.price ?? 0).toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card className="border-[#B7885E]/20 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#3B2C24]">Saved Addresses</CardTitle>
                  <Button
                    onClick={() => setIsAddAddressDialogOpen(true)}
                    className="bg-[#B7885E] hover:bg-[#9d7350] text-white"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
                <CardDescription className="text-[#8B7355]">
                  Manage your delivery addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedAddresses.length === 0 && !profile.address ? (
                    <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                      <CardContent className="py-16 text-center">
                        <MapPin className="w-16 h-16 text-[#B7885E] mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-[#3B2C24] mb-2">No address saved</h3>
                        <p className="text-[#8B7355] mb-6">Update your profile or add a new address</p>
                        <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white" onClick={() => setIsAddAddressDialogOpen(true)}>
                          Add New Address
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {profile.address && (
                        <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <h3 className="font-semibold text-[#3B2C24]">Default Address</h3>
                                  <Badge className="bg-[#B7885E] text-white hover:bg-[#B7885E]">
                                    Default
                                  </Badge>
                                </div>
                                <p className="text-[#3B2C24] mb-1">{profile.name}</p>
                                <p className="text-[#8B7355] text-sm mb-1">{profile.address}</p>
                                <p className="text-[#8B7355] text-sm">{profile.phone}</p>
                                <p className="text-[#8B7355] text-sm">{profile.email}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="text-[#B7885E]" onClick={() => setActiveTab('profile')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {savedAddresses.map((addr) => (
                        <Card key={addr.id} className="border-[#B7885E]/20 shadow-lg bg-white">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <h3 className="font-semibold text-[#3B2C24]">{addr.label}</h3>
                                  {addr.isDefault && (
                                    <Badge className="bg-[#B7885E] text-white hover:bg-[#B7885E]">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[#3B2C24] mb-1">{addr.name}</p>
                                <p className="text-[#8B7355] text-sm mb-1">{addr.address}</p>
                                <p className="text-[#8B7355] text-sm mb-1">{addr.city}, {addr.province} {addr.postal}</p>
                                <p className="text-[#8B7355] text-sm">{addr.phone}</p>
                              </div>
                              <div className="flex gap-2">
                                {!addr.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#B7885E]"
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                  >
                                    Set Default
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteAddress(addr.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
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
                {/* Notification Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={notificationFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationFilter("all")}
                    className={notificationFilter === "all" ? "bg-[#B7885E] text-white hover:bg-[#9d7350]" : "border-[#B7885E]/20 text-[#3B2C24] hover:bg-[#FFF5E6]/50"}
                  >
                    All ({notifications.length})
                  </Button>
                  <Button 
                    variant={notificationFilter === "order" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => setNotificationFilter("order")} 
                    className={notificationFilter === "order" ? "bg-blue-600 text-white hover:bg-blue-700" : "border-[#B7885E]/20 text-[#3B2C24] hover:bg-blue-50"}
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Orders ({notifications.filter((n: any) => n.type === 'order').length})
                  </Button>
                  <Button 
                    variant={notificationFilter === "promo" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => setNotificationFilter("promo")} 
                    className={notificationFilter === "promo" ? "bg-purple-600 text-white hover:bg-purple-700" : "border-[#B7885E]/20 text-[#3B2C24] hover:bg-purple-50"}
                  >
                    <Gift className="w-4 h-4 mr-1" />
                    Promotions ({notifications.filter((n: any) => n.type === 'promo').length})
                  </Button>
                  <Button 
                    variant={notificationFilter === "delivery" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => setNotificationFilter("delivery")} 
                    className={notificationFilter === "delivery" ? "bg-green-600 text-white hover:bg-green-700" : "border-[#B7885E]/20 text-[#3B2C24] hover:bg-green-50"}
                  >
                    <Truck className="w-4 h-4 mr-1" />
                    Delivery ({notifications.filter((n: any) => n.type === 'delivery').length})
                  </Button>
                  <Button 
                    variant={notificationFilter === "system" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => setNotificationFilter("system")} 
                    className={notificationFilter === "system" ? "bg-orange-600 text-white hover:bg-orange-700" : "border-[#B7885E]/20 text-[#3B2C24] hover:bg-orange-50"}
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    System ({notifications.filter((n: any) => n.type === 'system').length})
                  </Button>
                </div>
                <div className="space-y-3">
                  {filteredNotifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`p-4 border border-[#B7885E]/20 rounded-lg cursor-pointer hover:bg-[#FFF5E6]/50 transition-colors ${
                        !notification.read ? 'bg-[#FFF5E6]/50' : 'bg-white'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
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
                          <p className="text-xs text-[#8B7355]">{new Date(notification.time).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No notifications yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#3B2C24]">Add New Address</DialogTitle>
            <DialogDescription className="text-[#8B7355]">
              Add a new delivery address to your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#3B2C24] mb-2 block">Address Label</Label>
              <Input
                placeholder="e.g., Home, Work, Office"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="border-[#B7885E]/20"
              />
            </div>

            <div>
              <Label className="text-[#3B2C24] mb-2 block">Full Name</Label>
              <Input
                placeholder="Recipient name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className="border-[#B7885E]/20"
              />
            </div>

            <div>
              <Label className="text-[#3B2C24] mb-2 block">Street Address</Label>
              <Input
                placeholder="Street address, apartment, etc."
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                className="border-[#B7885E]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#3B2C24] mb-2 block">City</Label>
                <Input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="border-[#B7885E]/20"
                />
              </div>
              <div>
                <Label className="text-[#3B2C24] mb-2 block">Province</Label>
                <Input
                  placeholder="Province"
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                  className="border-[#B7885E]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#3B2C24] mb-2 block">Postal Code</Label>
                <Input
                  placeholder="Postal code"
                  value={newAddress.postal}
                  onChange={(e) => setNewAddress({ ...newAddress, postal: e.target.value })}
                  className="border-[#B7885E]/20"
                />
              </div>
              <div>
                <Label className="text-[#3B2C24] mb-2 block">Phone Number</Label>
                <Input
                  placeholder="09XX-XXX-XXXX"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="border-[#B7885E]/20"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddAddressDialogOpen(false);
                setNewAddress({
                  label: '',
                  name: '',
                  address: '',
                  city: '',
                  province: '',
                  postal: '',
                  phone: ''
                });
              }}
              className="border-[#B7885E] text-[#B7885E] hover:bg-[#B7885E] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAddress}
              className="bg-[#B7885E] hover:bg-[#9d7350] text-white"
            >
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#3B2C24]">Write a Review</DialogTitle>
            <DialogDescription className="text-[#8B7355]">
              Rate your experience with {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#3B2C24] mb-2 block">Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewData.rating
                          ? 'fill-[#B7885E] text-[#B7885E]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="commentary" className="text-[#3B2C24] mb-2 block">
                Your Review
              </Label>
              <Textarea
                id="commentary"
                placeholder="Share your thoughts about this product..."
                value={reviewData.commentary}
                onChange={(e) => setReviewData({ ...reviewData, commentary: e.target.value })}
                className="min-h-[100px] border-[#B7885E]/20 focus:border-[#B7885E]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReviewDialogOpen(false);
                setReviewData({ rating: 0, commentary: '' });
                setSelectedOrder(null);
                setSelectedProduct(null);
              }}
              className="border-[#B7885E] text-[#B7885E] hover:bg-[#B7885E] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewData.rating === 0}
              className="bg-[#B7885E] hover:bg-[#9d7350] text-white disabled:bg-gray-300"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
