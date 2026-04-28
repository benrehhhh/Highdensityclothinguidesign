import { useState } from 'react';
import { Link } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
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
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { getCart, removeCartItem, updateCartItemQuantity } from '../../lib/data-store';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(getCart());

  const [shippingMethod, setShippingMethod] = useState('standard');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(id, newQuantity);
    setCartItems(getCart());
  };

  const removeItem = (id: number) => {
    removeCartItem(id);
    setCartItems(getCart());
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const shippingFee = shippingMethod === 'express' ? 200 : subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shippingFee;

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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-[#B7885E]/20 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link to={`/home/product/${item.productId}`} className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#f5ede0]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link to={`/home/product/${item.productId}`}>
                              <h3 className="font-semibold text-[#3B2C24] hover:text-[#B7885E] transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="flex gap-4 mt-1 text-sm text-[#8B7355]">
                              <span>Size: {item.size}</span>
                              <span>Color: {item.color}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
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

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-xl font-semibold text-[#B7885E]">
                              ₱{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-xs text-[#8B7355]">
                              ₱{item.price.toLocaleString()} each
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
                  {/* Shipping Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#3B2C24]">Shipping Method</label>
                    <Select value={shippingMethod} onValueChange={setShippingMethod}>
                      <SelectTrigger className="border-[#B7885E]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (3-5 days) - {subtotal >= 1000 ? 'FREE' : '₱100'}</SelectItem>
                        <SelectItem value="express">Express (1-2 days) - ₱200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-[#B7885E]/20" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[#3B2C24]">
                      <span>Subtotal</span>
                      <span>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#3B2C24]">
                      <span>Shipping Fee</span>
                      <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                        {shippingFee === 0 ? 'FREE' : `₱${shippingFee.toLocaleString()}`}
                      </span>
                    </div>
                    {subtotal >= 1000 && shippingMethod === 'standard' && (
                      <p className="text-xs text-green-600">
                        🎉 You qualify for free shipping!
                      </p>
                    )}
                  </div>

                  <Separator className="bg-[#B7885E]/20" />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-[#3B2C24]">Total</span>
                    <span className="text-2xl font-semibold text-[#B7885E]">
                      ₱{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link to="/home/checkout">
                    <Button className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white py-6 mt-4">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link to="/home/catalog">
                    <Button variant="outline" className="w-full border-[#B7885E]/20 text-[#3B2C24]">
                      Continue Shopping
                    </Button>
                  </Link>

                  {/* Security Badge */}
                  <div className="pt-4 text-center">
                    <p className="text-xs text-[#8B7355] flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure checkout
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
