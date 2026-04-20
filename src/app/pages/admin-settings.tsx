import { useState } from 'react';
import { User, Lock, Bell, Shield, Mail, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const admin = {
    name: 'Admin User',
    email: 'admin@highdensity.com',
    role: 'System Administrator',
    initials: 'AU'
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings updated');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your admin account and preferences</p>
        </div>

        {/* Profile Card */}
        <Card className="border-gray-200 shadow-sm mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 bg-gray-900 text-white">
                  <AvatarFallback className="bg-gray-900 text-white text-2xl">
                    {admin.initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-800 text-white"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{admin.name}</h3>
                <p className="text-gray-600">{admin.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-900">{admin.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Lock className="w-4 h-4 mr-2" />
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Profile Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-900">First Name</Label>
                    <Input defaultValue="Admin" className="border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900">Last Name</Label>
                    <Input defaultValue="User" className="border-gray-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900">Email Address</Label>
                  <Input type="email" defaultValue={admin.email} className="border-gray-200" />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900">Phone Number</Label>
                  <Input type="tel" placeholder="+63 9XX XXX XXXX" className="border-gray-200" />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900">Role</Label>
                  <Input value={admin.role} disabled className="border-gray-200 bg-gray-50" />
                </div>

                <Separator className="my-4" />

                <Button onClick={handleSaveProfile} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Security Settings</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your account security and access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="border-gray-200">
                    Enable 2FA
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Current Session</p>
                          <p className="text-sm text-gray-600">Windows • Chrome • 192.168.1.1</p>
                          <p className="text-xs text-gray-500 mt-1">Active now</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-200">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Login History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="text-sm text-gray-900">Login successful</p>
                        <p className="text-xs text-gray-500">Today at 9:30 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="text-sm text-gray-900">Login successful</p>
                        <p className="text-xs text-gray-500">Yesterday at 4:15 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button onClick={handleSaveSecurity} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Change Password</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-900">Current Password</Label>
                  <Input type="password" className="border-gray-200" />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900">New Password</Label>
                  <Input type="password" className="border-gray-200" />
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900">Confirm New Password</Label>
                  <Input type="password" className="border-gray-200" />
                </div>

                <Separator className="my-4" />

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>

                <Button onClick={handleChangePassword} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-600">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">New Orders</h4>
                      <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">Low Stock Alerts</h4>
                      <p className="text-sm text-gray-600">Alert when products are running low</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Messages</h4>
                      <p className="text-sm text-gray-600">Notifications for customer inquiries</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">Delivery Updates</h4>
                      <p className="text-sm text-gray-600">Track delivery status changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900">System Updates</h4>
                      <p className="text-sm text-gray-600">Important system announcements</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing & Promotions</h4>
                      <p className="text-sm text-gray-600">Updates about new features and promotions</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Email Preferences</h3>
                  <div className="space-y-2">
                    <Label className="text-gray-900">Notification Email</Label>
                    <Input
                      type="email"
                      defaultValue={admin.email}
                      className="border-gray-200"
                      leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
                    />
                    <p className="text-xs text-gray-500">
                      This email will be used for all admin notifications
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="bg-gray-900 hover:bg-gray-800 text-white">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
