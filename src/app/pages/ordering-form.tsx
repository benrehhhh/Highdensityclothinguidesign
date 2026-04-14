import { useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  CreditCard,
  CheckCircle2,
  Package,
  Palette,
  Ruler,
  Hash,
  Shirt
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function OrderingForm() {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const product = {
    name: 'Handcrafted Cotton Shirt',
    description: 'Premium handmade cotton shirt with meticulous attention to detail. Each piece is carefully crafted to ensure comfort and durability.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzM4ODc3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Cream', 'Brown', 'Black']
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    toast.success('Order placed successfully!', {
      description: 'We will contact you shortly to confirm your order.'
    });
  };

  const total = product.price * quantity;

  return (
    <div className="min-h-screen bg-[#FFF5E6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#B7885E] rounded-lg flex items-center justify-center">
              <Shirt className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#3B2C24]">High Density Clothing</h1>
              <p className="text-sm text-[#B7885E]">Handmade with Love</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Preview */}
          <div className="space-y-6">
            <Card className="border-[#B7885E]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <Package className="w-5 h-5 text-[#B7885E]" />
                    Product Details
                  </CardTitle>
                  <Badge className="bg-green-500 text-white">
                    {product.stock} In Stock
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-[#f5ede0]">
                  <ImageWithFallback 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-[#3B2C24] mb-2">{product.name}</h3>
                  <p className="text-[#8B7355] leading-relaxed">{product.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-3xl font-semibold text-[#B7885E]">₱{product.price}</span>
                    <span className="text-sm text-[#8B7355]">per piece</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Product Options */}
              <Card className="border-[#B7885E]/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#3B2C24]">Select Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Size Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Ruler className="w-4 h-4 text-[#B7885E]" />
                      Size
                    </Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize} required>
                      <SelectTrigger className="bg-white border-[#B7885E]/20">
                        <SelectValue placeholder="Choose size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Palette className="w-4 h-4 text-[#B7885E]" />
                      Color
                    </Label>
                    <Select value={selectedColor} onValueChange={setSelectedColor} required>
                      <SelectTrigger className="bg-white border-[#B7885E]/20">
                        <SelectValue placeholder="Choose color" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.colors.map((color) => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Hash className="w-4 h-4 text-[#B7885E]" />
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="bg-white border-[#B7885E]/20"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="border-[#B7885E]/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#3B2C24]">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <User className="w-4 h-4 text-[#B7885E]" />
                      Full Name
                    </Label>
                    <Input 
                      placeholder="Juan Dela Cruz" 
                      className="bg-white border-[#B7885E]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <MapPin className="w-4 h-4 text-[#B7885E]" />
                      Complete Address
                    </Label>
                    <Textarea 
                      placeholder="Street, Barangay, City, Province" 
                      className="bg-white border-[#B7885E]/20 resize-none"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Phone className="w-4 h-4 text-[#B7885E]" />
                      Contact Number
                    </Label>
                    <Input 
                      type="tel" 
                      placeholder="09XX XXX XXXX" 
                      className="bg-white border-[#B7885E]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Mail className="w-4 h-4 text-[#B7885E]" />
                      Email Address
                    </Label>
                    <Input 
                      type="email" 
                      placeholder="juan@example.com" 
                      className="bg-white border-[#B7885E]/20"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-[#B7885E]/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <CreditCard className="w-5 h-5 text-[#B7885E]" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                    <SelectTrigger className="bg-white border-[#B7885E]/20">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                      <SelectItem value="gcash">GCash</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="border-[#B7885E]/20 shadow-lg bg-[#f5ede0]/50">
                <CardHeader>
                  <CardTitle className="text-[#3B2C24]">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-[#3B2C24]">
                    <span>Product Price</span>
                    <span>₱{product.price}</span>
                  </div>
                  <div className="flex justify-between text-[#3B2C24]">
                    <span>Quantity</span>
                    <span>×{quantity}</span>
                  </div>
                  <div className="border-t border-[#B7885E]/20 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-[#3B2C24]">Total Amount</span>
                    <span className="text-2xl font-semibold text-[#B7885E]">₱{total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                type="submit"
                className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white py-6 text-lg shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Place Order
              </Button>

              {/* Confirmation Message */}
              {showConfirmation && (
                <Card className="border-green-500/20 bg-green-50 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Order Confirmed!</h4>
                        <p className="text-sm text-green-700">
                          Thank you for your order! We will contact you within 24 hours to confirm your order details and delivery information.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
