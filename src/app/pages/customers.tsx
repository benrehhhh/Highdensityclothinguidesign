import { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone,
  MapPin,
  ShoppingBag,
  Star,
  Calendar,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '../components/ui/dialog';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';

const customers = [
  {
    id: 1,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '0917 123 4567',
    address: 'Quezon City, Metro Manila',
    orders: 8,
    totalSpent: 12450,
    tag: 'VIP',
    joined: '2024-01-15',
    lastOrder: '2024-03-10',
    notes: 'Prefers beige and cream colors. Size M.'
  },
  {
    id: 2,
    name: 'Juan Dela Cruz',
    email: 'juan.cruz@email.com',
    phone: '0918 234 5678',
    address: 'Makati City, Metro Manila',
    orders: 4,
    totalSpent: 5980,
    tag: 'Returning',
    joined: '2024-02-20',
    lastOrder: '2024-03-15',
    notes: 'Likes polo shirts. Usually orders size L.'
  },
  {
    id: 3,
    name: 'Ana Reyes',
    email: 'ana.reyes@email.com',
    phone: '0919 345 6789',
    address: 'Pasig City, Metro Manila',
    orders: 1,
    totalSpent: 1299,
    tag: 'New',
    joined: '2024-03-18',
    lastOrder: '2024-03-18',
    notes: ''
  },
  {
    id: 4,
    name: 'Pedro Garcia',
    email: 'pedro.garcia@email.com',
    phone: '0920 456 7890',
    address: 'Taguig City, Metro Manila',
    orders: 12,
    totalSpent: 18750,
    tag: 'VIP',
    joined: '2023-11-05',
    lastOrder: '2024-03-12',
    notes: 'Bulk buyer. Prefers dark colors.'
  },
  {
    id: 5,
    name: 'Sofia Lim',
    email: 'sofia.lim@email.com',
    phone: '0921 567 8901',
    address: 'Mandaluyong City, Metro Manila',
    orders: 6,
    totalSpent: 8940,
    tag: 'Returning',
    joined: '2024-01-28',
    lastOrder: '2024-03-08',
    notes: 'Prefers cotton material.'
  },
  {
    id: 6,
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    phone: '0922 678 9012',
    address: 'Manila City, Metro Manila',
    orders: 2,
    totalSpent: 2850,
    tag: 'New',
    joined: '2024-03-05',
    lastOrder: '2024-03-14',
    notes: ''
  },
];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'VIP':
        return 'bg-purple-100 text-purple-700';
      case 'Returning':
        return 'bg-blue-100 text-blue-700';
      case 'New':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#3B2C24]">Customer Management</h1>
          <p className="text-[#8B7355] mt-1">
            View and manage your customer base
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">Total Customers</p>
                <p className="text-3xl font-semibold text-[#3B2C24] mt-1">{customers.length}</p>
              </div>
              <Users className="w-12 h-12 text-[#B7885E] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">VIP Customers</p>
                <p className="text-3xl font-semibold text-purple-600 mt-1">
                  {customers.filter(c => c.tag === 'VIP').length}
                </p>
              </div>
              <Star className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">New This Month</p>
                <p className="text-3xl font-semibold text-green-600 mt-1">
                  {customers.filter(c => c.tag === 'New').length}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">Total Revenue</p>
                <p className="text-3xl font-semibold text-[#B7885E] mt-1">
                  ₱{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </p>
              </div>
              <ShoppingBag className="w-12 h-12 text-[#B7885E] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-[#B7885E]/20 bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#B7885E]/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="border-[#B7885E]/20 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
            <Users className="w-5 h-5 text-[#B7885E]" />
            Customer List
          </CardTitle>
          <CardDescription className="text-[#8B7355]">
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border border-[#B7885E]/20 rounded-lg hover:bg-[#FFF5E6]/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-12 h-12 bg-[#B7885E] text-white">
                    <AvatarFallback className="bg-[#B7885E] text-white">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#3B2C24]">{customer.name}</h4>
                      <Badge className={getTagColor(customer.tag)}>
                        {customer.tag}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-[#8B7355]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {customer.address}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#B7885E]">{customer.orders}</p>
                    <p className="text-xs text-[#8B7355]">Orders</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-[#3B2C24]">
                      ₱{customer.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#8B7355]">Total Spent</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCustomer(customer)}
                    className="border-[#B7885E]/20 text-[#B7885E] hover:bg-[#FFF5E6]"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Profile Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-[#3B2C24]">
              <Avatar className="w-12 h-12 bg-[#B7885E] text-white">
                <AvatarFallback className="bg-[#B7885E] text-white">
                  {selectedCustomer && getInitials(selectedCustomer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  {selectedCustomer?.name}
                  {selectedCustomer && (
                    <Badge className={getTagColor(selectedCustomer.tag)}>
                      {selectedCustomer.tag}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-normal text-[#8B7355] mt-0.5">
                  Customer since {selectedCustomer?.joined}
                </p>
              </div>
            </DialogTitle>
            <DialogDescription className="text-[#8B7355]">
              View customer details and order history
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-[#3B2C24] mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#8B7355]">
                    <Mail className="w-4 h-4 text-[#B7885E]" />
                    {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2 text-[#8B7355]">
                    <Phone className="w-4 h-4 text-[#B7885E]" />
                    {selectedCustomer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-[#8B7355]">
                    <MapPin className="w-4 h-4 text-[#B7885E]" />
                    {selectedCustomer.address}
                  </div>
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <h4 className="font-semibold text-[#3B2C24] mb-3">Purchase History</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-[#B7885E]/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="w-4 h-4 text-[#B7885E]" />
                        <span className="text-sm text-[#8B7355]">Total Orders</span>
                      </div>
                      <p className="text-2xl font-semibold text-[#3B2C24]">
                        {selectedCustomer.orders}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-[#B7885E]/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="w-4 h-4 text-[#B7885E]" />
                        <span className="text-sm text-[#8B7355]">Total Spent</span>
                      </div>
                      <p className="text-2xl font-semibold text-[#B7885E]">
                        ₱{selectedCustomer.totalSpent.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-3 p-3 bg-[#FFF5E6]/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-[#8B7355]">
                    <Calendar className="w-4 h-4 text-[#B7885E]" />
                    Last order: {selectedCustomer.lastOrder}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-semibold text-[#3B2C24] mb-3">Customer Notes</h4>
                <Textarea
                  defaultValue={selectedCustomer.notes}
                  placeholder="Add notes about this customer..."
                  className="border-[#B7885E]/20 resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
