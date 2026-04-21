import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, Shirt, User, Shield, Copy, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';

export function UnifiedLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo Accounts
  const DEMO_ACCOUNTS = {
    admin: {
      email: 'admin@highdensity.com',
      password: 'Admin123',
      type: 'admin'
    },
    user: {
      email: 'user@demo.com',
      password: 'UserDemo2024',
      name: 'Demo User',
      type: 'user'
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Check admin account
      if (email === DEMO_ACCOUNTS.admin.email && password === DEMO_ACCOUNTS.admin.password) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', email);
        toast.success('Admin login successful');
        navigate('/admin');
      }
      // Check user account or registered users
      else if (email === DEMO_ACCOUNTS.user.email && password === DEMO_ACCOUNTS.user.password) {
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userName', DEMO_ACCOUNTS.user.name);
        localStorage.setItem('userEmail', email);
        toast.success('Welcome back!');
        navigate('/home');
      }
      // Check for registered users in localStorage
      else {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

        if (user) {
          localStorage.setItem('userAuth', 'true');
          localStorage.setItem('userName', user.fullName);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('userPhone', user.phone);
          localStorage.setItem('userAddress', user.address);
          toast.success(`Welcome back, ${user.fullName}!`);
          navigate('/home');
        } else {
          setError('Invalid email or password. Please try one of the demo accounts below or register.');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const autoFill = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.password);
    } else {
      setEmail(DEMO_ACCOUNTS.user.email);
      setPassword(DEMO_ACCOUNTS.user.password);
    }
    toast.success(`${type === 'admin' ? 'Admin' : 'User'} credentials auto-filled`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5E6] via-[#f5ede0] to-[#FFF5E6] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#B7885E] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shirt className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[#3B2C24]">High Density Clothing</h1>
          <p className="text-[#8B7355] mt-1">Sign in to your account</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Login Form */}
          <Card className="border-[#B7885E]/20 shadow-2xl bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#3B2C24]">Welcome Back</CardTitle>
              <CardDescription className="text-[#8B7355]">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#B7885E] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#B7885E] hover:text-[#9d7350] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white rounded-lg py-6"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Login'
                  )}
                </Button>

                {/* Register Link */}
                <p className="text-center text-sm text-[#8B7355]">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="font-medium text-[#B7885E] hover:text-[#9d7350] transition-colors"
                  >
                    Create One
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Right Side - Demo Accounts */}
          <div className="space-y-6">
            {/* User Demo Account */}
            <Card className="border-[#B7885E]/20 shadow-xl bg-white">
              <CardHeader className="bg-gradient-to-r from-[#B7885E] to-[#9d7350] text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">User Demo Account</CardTitle>
                    <CardDescription className="text-white/80 text-sm">
                      Test the customer experience
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Email */}
                <div className="p-3 bg-[#FFF5E6] rounded-lg border border-[#B7885E]/20">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-[#8B7355]">EMAIL</Label>
                    <button
                      onClick={() => copyToClipboard(DEMO_ACCOUNTS.user.email, 'Email')}
                      className="text-[#B7885E] hover:text-[#9d7350]"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <code className="text-[#3B2C24] font-mono font-semibold">{DEMO_ACCOUNTS.user.email}</code>
                </div>

                {/* Password */}
                <div className="p-3 bg-[#FFF5E6] rounded-lg border border-[#B7885E]/20">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-[#8B7355]">PASSWORD</Label>
                    <button
                      onClick={() => copyToClipboard(DEMO_ACCOUNTS.user.password, 'Password')}
                      className="text-[#B7885E] hover:text-[#9d7350]"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <code className="text-[#3B2C24] font-mono font-semibold">{DEMO_ACCOUNTS.user.password}</code>
                </div>

                {/* Auto-fill Button */}
                <Button
                  onClick={() => autoFill('user')}
                  variant="outline"
                  className="w-full border-[#B7885E] text-[#B7885E] hover:bg-[#B7885E] hover:text-white"
                >
                  Auto-fill User Credentials
                </Button>

                {/* Features */}
                <div className="pt-2">
                  <p className="text-xs text-[#8B7355] mb-2 font-medium">Access to:</p>
                  <ul className="space-y-1 text-xs text-[#8B7355]">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Shop products
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Shopping cart & checkout
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Order tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Wishlist & reviews
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Admin Demo Account */}
            <Card className="border-gray-700 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-lg border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#B7885E] rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Admin Demo Account</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      Access the admin dashboard
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Email */}
                <div className="p-3 bg-gray-950/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-gray-400">EMAIL</Label>
                    <button
                      onClick={() => copyToClipboard(DEMO_ACCOUNTS.admin.email, 'Email')}
                      className="text-[#B7885E] hover:text-[#9d7350]"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <code className="text-white font-mono font-semibold">{DEMO_ACCOUNTS.admin.email}</code>
                </div>

                {/* Password */}
                <div className="p-3 bg-gray-950/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-gray-400">PASSWORD</Label>
                    <button
                      onClick={() => copyToClipboard(DEMO_ACCOUNTS.admin.password, 'Password')}
                      className="text-[#B7885E] hover:text-[#9d7350]"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <code className="text-white font-mono font-semibold">{DEMO_ACCOUNTS.admin.password}</code>
                </div>

                {/* Auto-fill Button */}
                <Button
                  onClick={() => autoFill('admin')}
                  className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white"
                >
                  Auto-fill Admin Credentials
                </Button>

                {/* Features */}
                <div className="pt-2">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Access to:</p>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Admin dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Order management
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Inventory control
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#B7885E] rounded-full" />
                      Customer management
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#8B7355]">
            🔒 Demo accounts for testing purposes. In production, use secure authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
