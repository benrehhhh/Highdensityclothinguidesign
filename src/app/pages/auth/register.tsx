import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Phone, Mail, MapPin, Lock, Eye, EyeOff, Shirt } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      // Get existing registered users or create empty array
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Check if email already exists
      if (registeredUsers.some((u: any) => u.email === formData.email)) {
        setIsLoading(false);
        toast.error('Email already registered. Please login instead.');
        return;
      }

      // Add new user
      registeredUsers.push({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        address: formData.address,
        password: formData.password,
        registeredAt: new Date().toISOString()
      });

      // Save to localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Auto login after registration
      localStorage.setItem('userAuth', 'true');
      localStorage.setItem('userName', formData.fullName);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userPhone', formData.mobile);
      localStorage.setItem('userAddress', formData.address);

      setIsLoading(false);
      toast.success('Account created successfully!');
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#B7885E] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shirt className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#3B2C24]">High Density Clothing</h1>
          <p className="text-sm text-[#8B7355] mt-1">Create your account</p>
        </div>

        {/* Registration Card */}
        <Card className="border-[#B7885E]/20 shadow-xl bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#3B2C24]">Create Account</CardTitle>
            <CardDescription className="text-[#8B7355]">
              Join our community of handmade clothing lovers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Juan Dela Cruz"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Mobile and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type="tel"
                      name="mobile"
                      placeholder="09XX XXX XXXX"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="pl-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Complete Address */}
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Complete Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-[#8B7355]" />
                  <Textarea
                    name="address"
                    placeholder="Street, Barangay, City, Province"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg resize-none"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Password and Confirm Password */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 border-[#B7885E]/20 focus:border-[#B7885E] rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#B7885E] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white rounded-lg py-6"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  'Register'
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-[#8B7355]">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-[#B7885E] hover:text-[#9d7350] transition-colors"
                >
                  Login Here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[#8B7355] mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
