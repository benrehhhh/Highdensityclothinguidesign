import { Link } from 'react-router';
import { ArrowRight, Star, ShoppingBag, Heart, Sparkles, Package, Truck, UserCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';

const featuredProducts = [
  {
    id: 1,
    name: 'Handcrafted Cotton Shirt',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzM4ODc3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Linen Casual Polo',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xvdGhpbmclMjBkZXNpZ258ZW58MXx8fHwxNzczODYyNzMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'New'
  },
  {
    id: 3,
    name: 'Artisan Cotton Shirt',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1759366079659-dc182506fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwaGFuZG1hZGUlMjBzaGlydHxlbnwxfHx8fDE3NzM4ODk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Featured'
  },
  {
    id: 4,
    name: 'Premium Cotton Jacket',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1619708838487-d18b744f2ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYmFubmVyJTIwaGVyb3xlbnwxfHx8fDE3NzM4ODk4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Premium'
  }
];

const categories = [
  { name: 'Tops', count: 24, image: 'https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzM4ODc3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Bottoms', count: 18, image: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xvdGhpbmclMjBkZXNpZ258ZW58MXx8fHwxNzczODYyNzMxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Custom Orders', count: 12, image: 'https://images.unsplash.com/photo-1759366079659-dc182506fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwaGFuZG1hZGUlMjBzaGlydHxlbnwxfHx8fDE3NzM4ODk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Accessories', count: 15, image: 'https://images.unsplash.com/photo-1766727923658-ae4d4d837239?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBmYWJyaWMlMjB0ZXh0dXJlJTIwYmVpZ2V8ZW58MXx8fHwxNzczODg5ODI0fDA&ixlib=rb-4.1.0&q=80&w=1080' }
];

const testimonials = [
  {
    name: 'Maria Santos',
    rating: 5,
    comment: 'The quality is amazing! You can really feel the care put into each piece. Highly recommend!',
    date: 'March 2024'
  },
  {
    name: 'Juan Dela Cruz',
    rating: 5,
    comment: 'Best handmade clothing in the Philippines. The fabric is soft and durable. Worth every peso!',
    date: 'February 2024'
  },
  {
    name: 'Ana Reyes',
    rating: 5,
    comment: 'I love supporting local artisans. High Density makes beautiful, comfortable clothes.',
    date: 'March 2024'
  }
];

export function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    const storedUserName = localStorage.getItem('userName');
    setIsLoggedIn(userAuth === 'true');
    setUserName(storedUserName || 'User');
  }, []);

  return (
    <div>
      {/* Welcome Banner - Show only when logged in */}
      {isLoggedIn && (
        <section className="bg-gradient-to-r from-[#B7885E] to-[#9d7350] text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <UserCircle className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-semibold">Welcome back, {userName}! 👋</h2>
                  <p className="text-white/90 text-sm">Ready to discover more handcrafted treasures?</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/home/catalog">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#B7885E] text-[#676767]">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Link to="/home/track-order">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#B7885E] text-[#676767]">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Orders
                  </Button>
                </Link>
                <Link to="/home/account">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#B7885E] text-[#676767]">
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B2C24]/80 to-[#3B2C24]/40 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1619708838487-d18b744f2ea4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYmFubmVyJTIwaGVyb3xlbnwxfHx8fDE3NzM4ODk4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <Badge className="bg-[#DDB67D] text-[#3B2C24] mb-4 hover:bg-[#DDB67D]">
              <Sparkles className="w-3 h-3 mr-1" />
              Handcrafted with Love
            </Badge>
            <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-tight">
              Discover Artisan Clothing Made Just for You
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Each piece is carefully handcrafted with premium materials and meticulous attention to detail.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/home/catalog">
                <Button size="lg" className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#3B2C24] text-[#676767]">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#3B2C24] mb-3">Shop by Category</h2>
            <p className="text-[#8B7355]">Explore our handcrafted collections</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to="/home/catalog">
                <Card className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="pt-4 pb-4">
                    <h3 className="font-semibold text-[#3B2C24] mb-1">{category.name}</h3>
                    <p className="text-sm text-[#8B7355]">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#3B2C24] mb-3">Featured Products</h2>
            <p className="text-[#8B7355]">Handpicked favorites from our collection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all group overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-[#f5ede0]">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-[#B7885E] text-white hover:bg-[#B7885E]">
                    {product.badge}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 left-3 bg-white/90 hover:bg-white text-[#3B2C24] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-[#3B2C24] mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-[#B7885E]">₱{product.price.toLocaleString()}</span>
                    <Link to={`/home/product/${product.id}`}>
                      <Button size="sm" className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/home/catalog">
              <Button size="lg" variant="outline" className="border-[#B7885E]/20 text-[#3B2C24]">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#3B2C24] mb-3">Why Choose High Density</h2>
            <p className="text-[#8B7355]">Quality craftsmanship meets modern comfort</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#B7885E]/20 bg-white shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-[#FFF5E6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#B7885E]" />
                </div>
                <h3 className="font-semibold text-[#3B2C24] mb-2">Handcrafted Quality</h3>
                <p className="text-sm text-[#8B7355]">
                  Every piece is meticulously crafted by skilled artisans with years of experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#B7885E]/20 bg-white shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-[#FFF5E6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#B7885E]" />
                </div>
                <h3 className="font-semibold text-[#3B2C24] mb-2">Made with Love</h3>
                <p className="text-sm text-[#8B7355]">
                  We pour our passion into every stitch, creating clothing that tells a story.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#B7885E]/20 bg-white shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-[#FFF5E6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-[#B7885E]" />
                </div>
                <h3 className="font-semibold text-[#3B2C24] mb-2">Premium Materials</h3>
                <p className="text-sm text-[#8B7355]">
                  We use only the finest fabrics to ensure comfort and durability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#3B2C24] mb-3">What Our Customers Say</h2>
            <p className="text-[#8B7355]">Real feedback from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-[#B7885E]/20 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#DDB67D] text-[#DDB67D]" />
                    ))}
                  </div>
                  <p className="text-[#3B2C24] mb-4 leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#3B2C24]">{testimonial.name}</p>
                      <p className="text-sm text-[#8B7355]">{testimonial.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#B7885E] to-[#9d7350] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to Experience Handcrafted Excellence?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Browse our collection and find your perfect piece today.
          </p>
          <Link to="/home/catalog">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#B7885E] text-[#676767]">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}