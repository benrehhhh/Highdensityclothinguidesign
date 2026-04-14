import { Link } from 'react-router';
import { Shirt, ShoppingBag, Heart, Star, Sparkles, LogIn, UserPlus, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      {/* Header */}
      <header className="bg-white border-b border-[#B7885E]/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B7885E] rounded-lg flex items-center justify-center">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-[#3B2C24]">High Density</h2>
                <p className="text-xs text-[#B7885E]">Clothing</p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="border-[#B7885E]/20 text-[#3B2C24]">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
            <div className="bg-[#DDB67D] text-[#3B2C24] inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Handcrafted with Love</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-tight">
              Discover Artisan Clothing Made Just for You
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Each piece is carefully handcrafted with premium materials and meticulous attention to detail. Join our community and experience the art of handmade fashion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Shop
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#3B2C24]">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
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

      {/* Featured Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[#3B2C24] mb-3">Featured Collections</h2>
            <p className="text-[#8B7355]">Explore our handpicked favorites</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-[#f5ede0]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1568371600021-36b968768c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNsb3RoaW5nJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzM4ODc3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Handcrafted Shirts"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-4 pb-4">
                <h3 className="font-semibold text-[#3B2C24] mb-1">Handcrafted Shirts</h3>
                <p className="text-sm text-[#8B7355]">Premium cotton collection</p>
              </CardContent>
            </Card>

            <Card className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-[#f5ede0]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xvdGhpbmclMjBkZXNpZ258ZW58MXx8fHwxNzczODYyNzMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Casual Wear"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-4 pb-4">
                <h3 className="font-semibold text-[#3B2C24] mb-1">Casual Wear</h3>
                <p className="text-sm text-[#8B7355]">Comfortable daily essentials</p>
              </CardContent>
            </Card>

            <Card className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-[#f5ede0]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759366079659-dc182506fe63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwaGFuZG1hZGUlMjBzaGlydHxlbnwxfHx8fDE3NzM4ODk4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Custom Orders"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-4 pb-4">
                <h3 className="font-semibold text-[#3B2C24] mb-1">Custom Orders</h3>
                <p className="text-sm text-[#8B7355]">Personalized just for you</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-[#8B7355] mb-4">Login to explore our full collection</p>
            <Link to="/login">
              <Button size="lg" className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#B7885E] to-[#9d7350] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Admin Access Available
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Are you an administrator? Access the admin portal to manage inventory, orders, and customers.
          </p>
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#B7885E]">
              <Shield className="w-5 h-5 mr-2" />
              Admin Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3B2C24] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#B7885E] rounded-lg flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">High Density</h3>
                  <p className="text-sm text-white/70">Clothing</p>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Handcrafted clothing made with love and dedication. Supporting local artisans in the Philippines.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/login" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Email: info@highdensity.ph</li>
                <li>Phone: +63 XXX XXX XXXX</li>
                <li>Location: Philippines</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/70">
            <p>© 2024 High Density Clothing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
