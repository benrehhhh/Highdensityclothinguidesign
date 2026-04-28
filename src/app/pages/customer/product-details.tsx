import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { addToCart, getProductById, isWishlisted, toggleWishlist } from '../../lib/data-store';

const productImages = [
  'https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzM4ODc3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xvdGhpbmclMjBkZXNpZ258ZW58MXx8fHwxNzczODYyNzMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1759366079659-dc182506fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwaGFuZG1hZGUlMjBzaGlydHxlbnwxfHx8fDE3NzM4ODk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1619708838487-d18b744f2ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYmFubmVyJTIwaGVyb3xlbnwxfHx8fDE3NzM4ODk4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080'
];

const reviews = [
  {
    id: 1,
    name: 'Maria Santos',
    rating: 5,
    date: 'March 15, 2024',
    comment: 'Absolutely love this shirt! The quality is outstanding and it fits perfectly. The fabric is so soft and comfortable.',
    verified: true
  },
  {
    id: 2,
    name: 'Juan Dela Cruz',
    rating: 5,
    date: 'March 10, 2024',
    comment: 'Best purchase I\'ve made in a while. The craftsmanship is evident in every detail. Highly recommend!',
    verified: true
  },
  {
    id: 3,
    name: 'Ana Reyes',
    rating: 4,
    date: 'March 5, 2024',
    comment: 'Great quality shirt. The color is slightly different from the photo but still beautiful. Very comfortable to wear.',
    verified: true
  }
];

export function ProductDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const product = getProductById(Number(id));
  const [wishlisted, setWishlisted] = useState(product ? isWishlisted(product.id) : false);

  if (!product) {
    return <div className="min-h-screen py-8 text-center text-[#8B7355]">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: product.image
    });
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = () => {
    toggleWishlist(product.id);
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/home/catalog" className="flex items-center gap-2 text-[#8B7355] hover:text-[#B7885E] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-[#f5ede0] shadow-lg">
              <ImageWithFallback
                src={product.image || productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[#B7885E] shadow-md'
                      : 'border-transparent hover:border-[#DDB67D]'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Badge */}
            <div>
              {product.badge && (
                <Badge className="bg-[#B7885E] text-white mb-3 hover:bg-[#B7885E]">
                  {product.badge}
                </Badge>
              )}
              <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#DDB67D] text-[#DDB67D]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#8B7355]">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold text-[#B7885E]">
                ₱{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-[#8B7355] line-through">
                  ₱{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock ({product.stock} items)</span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            <Separator className="bg-[#B7885E]/20" />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-[#3B2C24] mb-2">Description</h3>
              <p className="text-[#8B7355] leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="font-semibold text-[#3B2C24]">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="border-[#B7885E]/20">
                  <SelectValue placeholder="Select size" />
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
              <label className="font-semibold text-[#3B2C24]">Color</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`group relative w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-[#B7885E] scale-110'
                        : 'border-gray-300 hover:border-[#DDB67D]'
                    }`}
                    title={color}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {selectedColor === color && (
                      <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-[#8B7355]">Selected: {selectedColor}</p>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="font-semibold text-[#3B2C24]">Quantity</label>
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="border-[#B7885E]/20 w-24"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#B7885E] hover:bg-[#9d7350] text-white py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleAddToWishlist}
                variant="outline"
                className={`border-[#B7885E]/20 py-6 ${
                  wishlisted ? 'bg-[#FFF5E6] text-[#B7885E]' : 'text-[#3B2C24]'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <Card className="border-[#B7885E]/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-[#3B2C24]">
                    <Truck className="w-5 h-5 text-[#B7885E]" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-[#8B7355]">Orders over ₱1000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#B7885E]/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 text-[#3B2C24]">
                    <Shield className="w-5 h-5 text-[#B7885E]" />
                    <div>
                      <p className="font-medium text-sm">Quality Guarantee</p>
                      <p className="text-xs text-[#8B7355]">Handcrafted quality</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-[#B7885E]/20 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-[#3B2C24] mb-3">Materials</h3>
              <p className="text-[#8B7355]">{product.materials}</p>
            </CardContent>
          </Card>

          <Card className="border-[#B7885E]/20 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-[#3B2C24] mb-3">Care Instructions</h3>
              <p className="text-[#8B7355]">{product.care}</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Reviews */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3B2C24]">Customer Reviews</h2>
            <Link to="/home/reviews">
              <Button variant="outline" className="border-[#B7885E]/20 text-[#3B2C24]">
                Write a Review
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="border-[#B7885E]/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-[#3B2C24]">{review.name}</p>
                        {review.verified && (
                          <Badge variant="outline" className="border-green-500 text-green-600 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#8B7355]">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-[#DDB67D] text-[#DDB67D]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#3B2C24] leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
