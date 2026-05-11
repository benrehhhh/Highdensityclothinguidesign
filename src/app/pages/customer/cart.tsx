import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { getCart, initStore, removeCartItem, updateCartItemQuantity, subscribeStore, refreshCart, addToCart } from '../../lib/data-store';
import { toast } from 'sonner';
import { adminApi } from '../../lib/admin-api';

interface CartItem {
  id: number;
  productId?: number;
  product_id?: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Always read from localStorage first
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart;
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    initStore().catch(() => undefined);
    // Always read from localStorage when component mounts
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    subscribeStore(() => {
      // Don't auto-refresh from API, use localStorage
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(cart);
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    });
  }, []);

  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    shippingMethod: 'standard',
    discountCode: '',
    appliedDiscount: null as any
  });

  const [discounts, setDiscounts] = useState<any[]>([]);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editData, setEditData] = useState({
    size: '',
    color: '',
    quantity: 1
  });

  useEffect(() => {
    const loadDiscounts = async () => {
      const availableDiscounts = await adminApi.getDiscounts();
      setDiscounts(availableDiscounts ?? []);
    };
    loadDiscounts();
  }, []);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhone = localStorage.getItem('userPhone');
    const userAddress = localStorage.getItem('userAddress');
    if (userName) {
      const nameParts = userName.split(' ');
      setCheckoutData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userEmail || '',
        phone: userPhone || '',
        address: userAddress || ''
      }));
    }
  }, []);

  const applyDiscount = (discountCode: string) => {
    const discount = discounts.find(d => d.code === discountCode);
    if (discount) {
      setCheckoutData(prev => ({ ...prev, appliedDiscount: discount }));
      toast.success(`Discount applied: ${discount.description} (${discount.percentage}% off)`);
    } else {
      toast.error('Invalid discount code');
    }
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
    setEditData({
      size: item.size,
      color: item.color,
      quantity: item.quantity
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    // Remove the old item
    await removeCartItem(editingItem.id);

    // Add the updated item with new size/color/quantity
    const productId = editingItem.product_id || editingItem.productId;
    if (!productId) {
      toast.error('Cannot update item: missing product ID');
      return;
    }

    const updatedItem = {
      productId,
      name: editingItem.name,
      price: editingItem.price,
      size: editData.size,
      color: editData.color,
      quantity: editData.quantity,
      image: editingItem.image
    };

    await addToCart(updatedItem);

    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast.success('Item updated successfully');
  };

  const handleProductClick = (item: CartItem) => {
    navigate(`/home/product/${item.product_id || item.productId}`, {
      state: {
        preSelectedSize: item.size,
        preSelectedColor: item.color,
        preSelectedQuantity: item.quantity
      }
    });
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItemQuantity(id, newQuantity);
  };

  const removeItem = async (id: number) => {
    await removeCartItem(id);
  };

  // Calculate totals based on selected items only
  const selectedCartItems = selectedItems.size > 0
    ? cartItems.filter(item => selectedItems.has(item.id))
    : [];

  // If no items are selected, show 0 and disable checkout
  const hasSelectedItems = selectedCartItems.length > 0;

  const subtotal = hasSelectedItems ? selectedCartItems.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 1)), 0) : 0;
  const shipping = hasSelectedItems ? (shippingMethod === 'express' ? 200 : (subtotal >= 1000 ? 0 : 100)) : 0;
  const discountAmount = checkoutData.appliedDiscount && subtotal > 0
    ? subtotal * (checkoutData.appliedDiscount.percentage / 100)
    : 0;
  const total = hasSelectedItems ? (subtotal + shipping - discountAmount) : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">Shopping Cart</h1>
          <p className="text-[#8B7355]">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="border-[#B7885E]/20 shadow-lg">
            <CardContent className="py-16 text-center">
              <ShoppingBag className="w-16 h-16 text-[#B7885E] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[#3B2C24] mb-2">Your cart is empty</h3>
              <p className="text-[#8B7355] mb-6">Add some handcrafted items to get started!</p>
              <Link to="/home/catalog">
                <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // ✅ KEY FIX: <> Fragment wraps the grid + both dialogs so they're valid JSX siblings
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Select All */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                    onChange={selectAllItems}
                    className="w-4 h-4 accent-[#B7885E]"
                  />
                  <span className="text-sm text-[#8B7355]">Select All</span>
                </div>

                {cartItems.map((item) => (
                  <Card key={item.id} className="border-[#B7885E]/20 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {/* Checkbox */}
                        <div className="flex items-center pt-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-4 h-4 accent-[#B7885E]"
                          />
                        </div>

                        {/* Product Image */}
                        <button onClick={() => handleProductClick(item)} className="flex-shrink-0 cursor-pointer">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#f5ede0]">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <button onClick={() => handleProductClick(item)} className="text-left">
                                <h3 className="font-semibold text-[#3B2C24] hover:text-[#B7885E] transition-colors">
                                  {item.name}
                                </h3>
                              </button>
                              <div className="flex gap-4 mt-1 text-sm text-[#8B7355]">
                                <span>Size: {item.size}</span>
                                <span>Color: {item.color}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(item)}
                                className="text-[#B7885E] hover:text-[#9d7350] hover:bg-[#f5ede0]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 border-[#B7885E]/20"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-12 text-center font-medium text-[#3B2C24]">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 border-[#B7885E]/20"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-semibold text-[#B7885E]">
                                ₱{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                              </p>
                              <p className="text-xs text-[#8B7355]">
                                ₱{(item.price ?? 0).toLocaleString()} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-[#B7885E]/20 shadow-lg sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-[#3B2C24]">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Separator className="bg-[#B7885E]/20" />

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-semibold text-gray-900">₱{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-gray-900">₱{shipping.toLocaleString()}</span>
                      </div>
                      {checkoutData.appliedDiscount && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Discount ({checkoutData.appliedDiscount.percentage}% off)</span>
                          <span className="font-semibold text-gray-900">-₱{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total</span>
                        <span className="font-semibold text-gray-900">₱{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Separator className="bg-[#B7885E]/20" />

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold text-[#3B2C24]">Total</span>
                      <span className="text-2xl font-semibold text-[#B7885E]">
                        ₱{total.toLocaleString()}
                      </span>
                    </div>

                    <Button
                      onClick={() => setIsCheckoutDialogOpen(true)}
                      disabled={!hasSelectedItems}
                      className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white py-6 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Checkout Dialog */}
            <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Checkout Information</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={checkoutData.firstName}
                        onChange={(e) => setCheckoutData({...checkoutData, firstName: e.target.value})}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={checkoutData.lastName}
                        onChange={(e) => setCheckoutData({...checkoutData, lastName: e.target.value})}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={checkoutData.phone}
                      onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                      placeholder="09XX XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address *</Label>
                    <Input
                      id="address"
                      required
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                      placeholder="123 Main Street, City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountCode">Discount Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="discountCode"
                        value={checkoutData.discountCode}
                        onChange={(e) => setCheckoutData({...checkoutData, discountCode: e.target.value})}
                        placeholder="Enter discount code"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => applyDiscount(checkoutData.discountCode)}
                        disabled={!checkoutData.discountCode}
                      >
                        Apply
                      </Button>
                    </div>
                    {checkoutData.appliedDiscount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">Discount Applied</p>
                            <p className="text-lg font-bold text-green-900">{checkoutData.appliedDiscount.description}</p>
                            <p className="text-sm text-green-600">{checkoutData.appliedDiscount.percentage}% off</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCheckoutData(prev => ({ ...prev, appliedDiscount: null, discountCode: '' }))}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Shipping Method</Label>
                    <Select
                      value={checkoutData.shippingMethod}
                      onValueChange={(value) => setCheckoutData({...checkoutData, shippingMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Shipping (3-5 business days)</SelectItem>
                        <SelectItem value="express">Express Shipping (1-2 business days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={checkoutData.paymentMethod}
                      onValueChange={(value) => setCheckoutData({...checkoutData, paymentMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                        <SelectItem value="gcash">GCash</SelectItem>
                        <SelectItem value="card">Debit/Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      // Form validation
                      if (!checkoutData.firstName.trim()) {
                        toast.error('Please enter your first name');
                        return;
                      }
                      if (!checkoutData.lastName.trim()) {
                        toast.error('Please enter your last name');
                        return;
                      }
                      if (!checkoutData.email.trim()) {
                        toast.error('Please enter your email');
                        return;
                      }
                      if (!checkoutData.phone.trim()) {
                        toast.error('Please enter your phone number');
                        return;
                      }
                      if (!checkoutData.address.trim()) {
                        toast.error('Please enter your address');
                        return;
                      }

                      // Get selected items or all items if none selected
                      const itemsToCheckout = selectedItems.size > 0
                        ? cartItems.filter(item => selectedItems.has(item.id))
                        : cartItems;

                      if (itemsToCheckout.length === 0) {
                        toast.error('Please select at least one item to checkout');
                        return;
                      }

                      // Calculate subtotal for selected items
                      const selectedSubtotal = itemsToCheckout.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 1)), 0);
                      const selectedShipping = shippingMethod === 'express' ? 200 : (selectedSubtotal >= 1000 ? 0 : 100);
                      const selectedTotal = selectedSubtotal + selectedShipping - (checkoutData.appliedDiscount ? Math.round(selectedSubtotal * (checkoutData.appliedDiscount.percentage / 100)) : 0);

                      const newOrder = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        total: selectedTotal,
                        items: itemsToCheckout,
                        shippingAddress: checkoutData.address,
                        shippingMethod: checkoutData.shippingMethod,
                        paymentMethod: checkoutData.paymentMethod,
                        discountCode: checkoutData.discountCode,
                        appliedDiscount: checkoutData.appliedDiscount,
                        customer: {
                          name: `${checkoutData.firstName} ${checkoutData.lastName}`,
                          email: checkoutData.email,
                          phone: checkoutData.phone
                        },
                        status: 'Pending Confirmation'
                      };

                      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                      existingOrders.push(newOrder);
                      localStorage.setItem('userOrders', JSON.stringify(existingOrders));

                      // Deduct stock from products
                      const products = JSON.parse(localStorage.getItem('products') || '[]');
                      const updatedProducts = products.map((product: any) => {
                        const cartItem = itemsToCheckout.find((item: any) => (item.product_id || item.productId) === product.id);
                        if (cartItem) {
                          return {
                            ...product,
                            stock: Math.max(0, product.stock - cartItem.quantity),
                            status: product.stock - cartItem.quantity <= 0 ? 'Out of Stock' : product.status
                          };
                        }
                        return product;
                      });
                      localStorage.setItem('products', JSON.stringify(updatedProducts));

                      // Remove checked out items from cart
                      const remainingItems = selectedItems.size > 0
                        ? cartItems.filter(item => !selectedItems.has(item.id))
                        : [];
                      localStorage.setItem('cart', JSON.stringify(remainingItems));

                      setCartItems(remainingItems);
                      setSelectedItems(new Set());
                      setIsCheckoutDialogOpen(false);
                      setCheckoutData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        address: '',
                        paymentMethod: 'cod',
                        shippingMethod: 'standard',
                        discountCode: '',
                        appliedDiscount: null
                      });

                      setConfirmedOrder(newOrder);
                      setIsOrderConfirmationOpen(true);
                      toast.success(`Order #${newOrder.id} placed successfully!`);
                    }}
                    disabled={cartItems.length === 0}
                  >
                    Place Order
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Order Confirmation Dialog - Receipt Style */}
            <Dialog open={isOrderConfirmationOpen} onOpenChange={setIsOrderConfirmationOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">Order Receipt</DialogTitle>
                </DialogHeader>

                {confirmedOrder && (
                  <div className="bg-white border-2 border-dashed border-[#B7885E]/30 rounded-lg p-6 space-y-4">
                    {/* Success Message */}
                    <div className="text-center border-b-2 border-dashed border-[#B7885E]/20 pb-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-green-600 font-semibold text-lg">Order Placed Successfully!</p>
                      <p className="text-[#8B7355] text-sm">Order ID: #{confirmedOrder.id}</p>
                      <p className="text-[#8B7355] text-xs mt-1">{new Date().toLocaleString()}</p>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 border-b-2 border-dashed border-[#B7885E]/20 pb-4">
                      <h4 className="font-semibold text-[#3B2C24] text-sm">Items</h4>
                      {confirmedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-[#8B7355]">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium text-[#3B2C24]">
                            ₱{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-1 border-b-2 border-dashed border-[#B7885E]/20 pb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#8B7355]">Subtotal</span>
                        <span className="text-[#3B2C24]">₱{confirmedOrder.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#8B7355]">Shipping</span>
                        <span className="text-[#3B2C24]">
                          ₱{confirmedOrder.shippingMethod === 'standard' ? 50 : confirmedOrder.shippingMethod === 'express' ? 100 : 150}
                        </span>
                      </div>
                      {confirmedOrder.appliedDiscount && (
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600">Discount ({confirmedOrder.appliedDiscount.percentage}%)</span>
                          <span className="text-green-600">-₱{Math.round(confirmedOrder.total * (confirmedOrder.appliedDiscount.percentage / 100)).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm pt-2">
                        <span className="text-[#3B2C24]">TOTAL</span>
                        <span className="text-[#B7885E] text-base">
                          ₱{(
                            confirmedOrder.total +
                            (confirmedOrder.shippingMethod === 'standard' ? 50 : confirmedOrder.shippingMethod === 'express' ? 100 : 150) -
                            (confirmedOrder.appliedDiscount ? Math.round(confirmedOrder.total * (confirmedOrder.appliedDiscount.percentage / 100)) : 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-1 text-xs border-b-2 border-dashed border-[#B7885E]/20 pb-4">
                      <h4 className="font-semibold text-[#3B2C24]">Ship To</h4>
                      <p className="text-[#8B7355]">{confirmedOrder.customer.name}</p>
                      <p className="text-[#8B7355]">{confirmedOrder.shippingAddress}</p>
                      <p className="text-[#8B7355]">{confirmedOrder.customer.phone}</p>
                    </div>

                    {/* Payment Method */}
                    <div className="text-xs text-center">
                      <p className="text-[#8B7355]">Payment via</p>
                      <p className="font-medium text-[#3B2C24]">
                        {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' :
                         confirmedOrder.paymentMethod === 'gcash' ? 'GCash' :
                         'Debit/Credit Card'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => {
                        setIsOrderConfirmationOpen(false);
                        setCartItems([]);
                        toast.success('Order placed successfully!');
                        navigate('/home/catalog');
                      }}
                      className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Edit Item Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Item</DialogTitle>
                </DialogHeader>
                {editingItem && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f5ede0]">
                        <ImageWithFallback
                          src={editingItem.image}
                          alt={editingItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#3B2C24]">{editingItem.name}</h3>
                        <p className="text-sm text-[#8B7355]">₱{editingItem.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Size</Label>
                      <Select value={editData.size} onValueChange={(value) => setEditData({...editData, size: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select value={editData.color} onValueChange={(value) => setEditData({...editData, color: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beige">Beige</SelectItem>
                          <SelectItem value="White">White</SelectItem>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Gray">Gray</SelectItem>
                          <SelectItem value="Cream">Cream</SelectItem>
                          <SelectItem value="Navy">Navy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        max="99"
                        value={editData.quantity}
                        onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value) || 1})}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}