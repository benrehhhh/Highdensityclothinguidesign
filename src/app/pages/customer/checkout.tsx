import { useState } from 'react';
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

export function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const cartSummary = {
    subtotal: 4297,
    shipping: 0,
    total: 4297
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Order placed successfully!', {
        description: 'You will receive a confirmation email shortly.'
      });
      navigate('/track-order');
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 bg-[#FFF5E6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">Checkout</h1>
          <p className="text-[#8B7355]">Complete your order</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Customer Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <User className="w-5 h-5 text-[#B7885E]" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#3B2C24]">First Name *</Label>
                      <Input 
                        placeholder="Juan" 
                        required 
                        className="border-[#B7885E]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#3B2C24]">Last Name *</Label>
                      <Input 
                        placeholder="Dela Cruz" 
                        required 
                        className="border-[#B7885E]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Mail className="w-4 h-4 text-[#B7885E]" />
                      Email Address *
                    </Label>
                    <Input 
                      type="email" 
                      placeholder="juan@example.com" 
                      required 
                      className="border-[#B7885E]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[#3B2C24]">
                      <Phone className="w-4 h-4 text-[#B7885E]" />
                      Phone Number *
                    </Label>
                    <Input 
                      type="tel" 
                      placeholder="09XX XXX XXXX" 
                      required 
                      className="border-[#B7885E]/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <MapPin className="w-5 h-5 text-[#B7885E]" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[#3B2C24]">Street Address *</Label>
                    <Input 
                      placeholder="123 Main Street" 
                      required 
                      className="border-[#B7885E]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#3B2C24]">Apartment, Suite, etc. (Optional)</Label>
                    <Input 
                      placeholder="Unit 4B" 
                      className="border-[#B7885E]/20"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#3B2C24]">City *</Label>
                      <Input 
                        placeholder="Quezon City" 
                        required 
                        className="border-[#B7885E]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#3B2C24]">Province *</Label>
                      <Select required>
                        <SelectTrigger className="border-[#B7885E]/20">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metro-manila">Metro Manila</SelectItem>
                          <SelectItem value="bulacan">Bulacan</SelectItem>
                          <SelectItem value="cavite">Cavite</SelectItem>
                          <SelectItem value="laguna">Laguna</SelectItem>
                          <SelectItem value="rizal">Rizal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#3B2C24]">Postal Code *</Label>
                      <Input 
                        placeholder="1100" 
                        required 
                        className="border-[#B7885E]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#3B2C24]">Barangay *</Label>
                      <Input 
                        placeholder="Barangay Name" 
                        required 
                        className="border-[#B7885E]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#3B2C24]">Delivery Notes (Optional)</Label>
                    <Textarea 
                      placeholder="Special instructions for delivery..." 
                      className="border-[#B7885E]/20 resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-[#B7885E]/20 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
                    <CreditCard className="w-5 h-5 text-[#B7885E]" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border border-[#B7885E]/20 rounded-lg hover:bg-[#FFF5E6]/50 transition-colors">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#3B2C24]">Cash on Delivery</p>
                              <p className="text-sm text-[#8B7355]">Pay when you receive your order</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border border-[#B7885E]/20 rounded-lg hover:bg-[#FFF5E6]/50 transition-colors">
                        <RadioGroupItem value="gcash" id="gcash" />
                        <Label htmlFor="gcash" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-[#3B2C24]">GCash</p>
                              <p className="text-sm text-[#8B7355]">Pay securely with GCash</p>
                            </div>
                            <span className="text-blue-600 font-semibold">GCash</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'gcash' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        You will be redirected to GCash to complete your payment after placing the order.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-[#B7885E]/20 shadow-lg bg-white sticky top-24">
                <CardHeader>
                  <CardTitle className="text-[#3B2C24]">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B7355]">Handcrafted Cotton Shirt (x2)</span>
                      <span className="text-[#3B2C24]">₱2,598</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B7355]">Linen Casual Polo (x1)</span>
                      <span className="text-[#3B2C24]">₱1,599</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8B7355]">Artisan Cotton Shirt (x1)</span>
                      <span className="text-[#3B2C24]">₱1,399</span>
                    </div>
                  </div>

                  <Separator className="bg-[#B7885E]/20" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[#3B2C24]">
                      <span>Subtotal</span>
                      <span>₱{cartSummary.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#3B2C24]">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  </div>

                  <Separator className="bg-[#B7885E]/20" />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-[#3B2C24]">Total</span>
                    <span className="text-2xl font-semibold text-[#B7885E]">
                      ₱{cartSummary.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="pt-3 pb-3 px-4 bg-[#FFF5E6] rounded-lg">
                    <p className="text-sm text-[#3B2C24]">
                      <span className="font-medium">Estimated Delivery:</span>
                      <br />
                      <span className="text-[#8B7355]">3-5 business days</span>
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <Button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white py-6"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <div className="pt-4 text-center space-y-2">
                    <p className="text-xs text-[#8B7355] flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Your payment information is secure
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
