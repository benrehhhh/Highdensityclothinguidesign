import { Link } from 'react-router';
import { useState } from 'react';
import { Heart, ShoppingCart, X, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { addToCart, getWishlistProducts, toggleWishlist } from '../../lib/data-store';

export function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(getWishlistProducts());
  const handleRemove = (id: number, name: string) => {
    toggleWishlist(id);
    setWishlistItems(getWishlistProducts());
    toast.success(`${name} removed from wishlist`);
  };

  const handleAddToCart = (item: (typeof wishlistItems)[number]) => {
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.price,
      size: item.sizes?.[0] ?? "M",
      color: item.colors?.[0] ?? "Default",
      quantity: 1,
      image: item.image
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#B7885E]" />
            My Wishlist
          </h1>
          <p className="text-[#8B7355]">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="border-[#B7885E]/20 shadow-lg bg-white">
            <CardContent className="py-16 text-center">
              <Heart className="w-16 h-16 text-[#B7885E] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[#3B2C24] mb-2">Your wishlist is empty</h3>
              <p className="text-[#8B7355] mb-6">Save items you love for later!</p>
              <Link to="/home/catalog">
                <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discover Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-[#f5ede0]">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {item.badge && (
                    <Badge className="absolute top-3 right-3 bg-[#B7885E] text-white hover:bg-[#B7885E]">
                      {item.badge}
                    </Badge>
                  )}

                  {/* Remove Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemove(item.id, item.name)}
                    className="absolute top-3 left-3 bg-white/90 hover:bg-white text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-white">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="pt-4">
                  <Link to={`/home/product/${item.productId}`}>
                    <h3 className="font-semibold text-[#3B2C24] mb-2 hover:text-[#B7885E] transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-semibold text-[#B7885E]">
                      ₱{item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className="flex-1 bg-[#B7885E] hover:bg-[#9d7350] text-white"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Link to={`/home/product/${item.productId}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-[#B7885E]/20">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/home/catalog">
              <Button variant="outline" className="border-[#B7885E]/20 text-[#3B2C24]">
                <Sparkles className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
