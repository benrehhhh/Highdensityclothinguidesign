import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu,
  Search,
  Shirt,
  Bell,
  X,
  LogOut,
  LogIn
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { cn } from './ui/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

export function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const cartCount = 3;
  const wishlistCount = 5;
  const notificationCount = 2;

  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    const storedUserName = localStorage.getItem('userName');
    setIsLoggedIn(userAuth === 'true');
    setUserName(storedUserName || 'User');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/home/catalog', label: 'Shop' },
    { path: '/home/about', label: 'About' },
    { path: '/home/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5E6]">
      {/* Header */}
      <header className="bg-white border-b border-[#B7885E]/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B7885E] rounded-lg flex items-center justify-center">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h2 className="font-semibold text-[#3B2C24]">High Density</h2>
                <p className="text-xs text-[#B7885E]">Clothing</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "transition-colors",
                    location.pathname === link.path
                      ? "text-[#B7885E] font-medium"
                      : "text-[#3B2C24] hover:text-[#B7885E]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* Search Icon - Hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-[#3B2C24] hover:text-[#B7885E] hover:bg-[#FFF5E6]"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <Link to="/home/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#3B2C24] hover:text-[#B7885E] hover:bg-[#FFF5E6]"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Wishlist */}
              <Link to="/home/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#3B2C24] hover:text-[#B7885E] hover:bg-[#FFF5E6]"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#B7885E] text-white text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/home/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#3B2C24] hover:text-[#B7885E] hover:bg-[#FFF5E6]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#B7885E] text-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Account */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#3B2C24] hover:text-[#B7885E] hover:bg-[#FFF5E6]"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      {userName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/home/account" className="w-full">
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/home/wishlist" className="w-full">
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/home/track-order" className="w-full">
                        Track Order
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/home/notifications" className="w-full">
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#3B2C24] hover:text-[#B7885E] hover:bg-[#FFF5E6]"
                  >
                    <LogIn className="w-5 h-5" />
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#3B2C24]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#B7885E]/20 bg-white">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 rounded-lg transition-colors",
                    location.pathname === link.path
                      ? "bg-[#FFF5E6] text-[#B7885E] font-medium"
                      : "text-[#3B2C24] hover:bg-[#FFF5E6]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#3B2C24] text-[#FFF5E6] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#B7885E] rounded-lg flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">High Density</h3>
                  <p className="text-xs text-[#DDB67D]">Clothing</p>
                </div>
              </div>
              <p className="text-sm text-[#FFF5E6]/80">
                Handcrafted clothing made with love and attention to detail. Each piece tells a story.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/home/catalog" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">Shop All</Link></li>
                <li><Link to="/home/about" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">About Us</Link></li>
                <li><Link to="/home/contact" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">Contact</Link></li>
                <li><Link to="/home/track-order" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">Track Order</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/home/account" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">My Account</Link></li>
                <li><Link to="/home/wishlist" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">Wishlist</Link></li>
                <li><a href="#" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-[#FFF5E6]/80 hover:text-[#DDB67D] transition-colors">Returns Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Get In Touch</h4>
              <ul className="space-y-2 text-sm text-[#FFF5E6]/80">
                <li>Email: hello@highdensity.com</li>
                <li>Phone: +63 917 123 4567</li>
                <li>Manila, Philippines</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 bg-[#B7885E] rounded-lg flex items-center justify-center hover:bg-[#DDB67D] transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-[#B7885E] rounded-lg flex items-center justify-center hover:bg-[#DDB67D] transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#B7885E]/20 mt-8 pt-8 text-center text-sm text-[#FFF5E6]/60">
            <p>&copy; 2024 High Density Clothing. All rights reserved. Handmade with ❤️ in the Philippines.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}