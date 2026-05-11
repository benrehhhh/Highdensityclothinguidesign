import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from 'sonner';
import { getCart, initStore, subscribeStore } from '../../lib/data-store';
import { api } from '../../lib/api';

export function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(getCart());
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    initStore().catch(() => undefined);
    setCartItems(getCart());
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setIsProcessing(true);

    try {
      const address = (document.querySelector('input[placeholder="123 Main Street"]') as HTMLInputElement)?.value || "Default Address";
      
      // Create order in localStorage
      const newOrder = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        total: total,
        items: cartItems,
        shippingAddress: address,
        paymentMethod: paymentMethod,
        status: 'Pending Confirmation',
        customer: {
          name: localStorage.getItem('userName') || 'Customer',
          email: localStorage.getItem('userEmail') || 'customer@example.com',
          phone: localStorage.getItem('userPhone') || '09XX XXX XXXX'
        }
      };
      
      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));
      
      // Deduct stock from products
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = products.map((product: any) => {
        const cartItem = cartItems.find((item: any) => item.productId === product.id);
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
      
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      setIsProcessing(false);
      toast.success('Order placed successfully!');
      navigate('/home/user-dashboard');
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen py-8 bg-[#FFF5E6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">Checkout</h1>
          <p className="text-[#8B7355]">Complete your order</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <User className="w-5 h-5 text-[#B7885E]" /> Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input placeholder="Juan" required className="border-[#B7885E]/20" /></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input placeholder="Dela Cruz" required className="border-[#B7885E]/20" /></div>
                  </div>
                  <div className="space-y-2"><Label>Email Address *</Label><Input type="email" placeholder="juan@example.com" required className="border-[#B7885E]/20" /></div>
                  <div className="space-y-2"><Label>Phone Number *</Label><Input type="tel" placeholder="09XX XXX XXXX" required className="border-[#B7885E]/20" /></div>
                </CardContent>
              </Card>

              <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <MapPin className="w-5 h-5 text-[#B7885E]" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Street Address *</Label><Input placeholder="123 Main Street" required className="border-[#B7885E]/20" /></div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>City *</Label><Input placeholder="Quezon City" required className="border-[#B7885E]/20" /></div>
                    <div className="space-y-2"><Label>Province *</Label>
                      <Select required>
                        <SelectTrigger className="border-[#B7885E]/20"><SelectValue placeholder="Select province" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metro-manila">Metro Manila</SelectItem>
                          <SelectItem value="bulacan">Bulacan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>Delivery Notes</Label><Textarea placeholder="Special instructions..." className="border-[#B7885E]/20 resize-none" rows={3} /></div>
                </CardContent>
              </Card>

              <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg"><RadioGroupItem value="cod" id="cod" /><Label htmlFor="cod">Cash on Delivery</Label></div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg"><RadioGroupItem value="gcash" id="gcash" /><Label htmlFor="gcash">GCash</Label></div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-[#B7885E]/20 shadow-lg bg-white sticky top-24">
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#8B7355]">{item.name} (x{item.quantity})</span>
                      <span className="text-[#3B2C24]">₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-[#3B2C24]">Total</span>
                    <span className="text-2xl font-semibold text-[#B7885E]">₱{total.toLocaleString()}</span>
                  </div>
                  <Button type="submit" disabled={isProcessing} className="w-full bg-[#B7885E] text-white py-6">
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
