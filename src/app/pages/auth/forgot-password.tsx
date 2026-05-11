import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, Shirt, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Reset link sent to your email');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5E6] via-[#f5ede0] to-[#FFF5E6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#B7885E] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shirt className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[#3B2C24]">High Density</h1>
        </div>

        <Card className="border-[#B7885E]/20 shadow-2xl bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#3B2C24]">Reset Password</CardTitle>
            <CardDescription className="text-[#8B7355]">
              {isSubmitted 
                ? "Check your email for the reset link" 
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-[#B7885E]/20 focus:border-[#B7885E]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#B7885E] hover:bg-[#9d7350] text-white py-6"
                >
                  {isLoading ? "Sending link..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    If an account exists for {email}, you will receive a password reset link shortly.
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="outline" 
                  className="w-full border-[#B7885E]/20"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try another email
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-[#B7885E] hover:text-[#9d7350] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
