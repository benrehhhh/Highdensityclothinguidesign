import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Percent,
  Clock,
  Gift,
  Award
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
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { toast } from 'sonner';

interface Discount {
  id: string;
  code: string;
  type: 'Coupon' | 'Flash Sale' | 'BOGO' | 'Loyalty';
  value: number;
  valueType: 'Percentage' | 'Fixed';
  startDate: string;
  endDate: string;
  minPurchase: number;
  maxUses: number;
  currentUses: number;
  status: 'Active' | 'Inactive' | 'Expired';
}

const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'SUMMER25',
    type: 'Coupon',
    value: 25,
    valueType: 'Percentage',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    minPurchase: 1000,
    maxUses: 100,
    currentUses: 45,
    status: 'Active'
  },
  {
    id: '2',
    code: 'FLASH200',
    type: 'Flash Sale',
    value: 200,
    valueType: 'Fixed',
    startDate: '2026-04-14',
    endDate: '2026-04-15',
    minPurchase: 2000,
    maxUses: 50,
    currentUses: 23,
    status: 'Active'
  },
  {
    id: '3',
    code: 'BOGO-SHIRTS',
    type: 'BOGO',
    value: 50,
    valueType: 'Percentage',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    minPurchase: 0,
    maxUses: 200,
    currentUses: 87,
    status: 'Active'
  },
  {
    id: '4',
    code: 'VIP10',
    type: 'Loyalty',
    value: 10,
    valueType: 'Percentage',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    minPurchase: 500,
    maxUses: 1000,
    currentUses: 234,
    status: 'Active'
  },
];

export function Discounts() {
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  const [discountForm, setDiscountForm] = useState({
    code: '',
    type: 'Coupon' as 'Coupon' | 'Flash Sale' | 'BOGO' | 'Loyalty',
    value: '',
    valueType: 'Percentage' as 'Percentage' | 'Fixed',
    startDate: '',
    endDate: '',
    minPurchase: '',
    maxUses: ''
  });

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || discount.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddDiscount = () => {
    if (!discountForm.code || !discountForm.value || !discountForm.startDate || !discountForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDiscount: Discount = {
      id: Date.now().toString(),
      code: discountForm.code.toUpperCase(),
      type: discountForm.type,
      value: parseFloat(discountForm.value),
      valueType: discountForm.valueType,
      startDate: discountForm.startDate,
      endDate: discountForm.endDate,
      minPurchase: parseFloat(discountForm.minPurchase) || 0,
      maxUses: parseInt(discountForm.maxUses) || 0,
      currentUses: 0,
      status: 'Active'
    };

    setDiscounts([...discounts, newDiscount]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Discount created successfully');
  };

  const handleEditDiscount = () => {
    if (!selectedDiscount) return;

    const updatedDiscounts = discounts.map(d =>
      d.id === selectedDiscount.id
        ? {
            ...d,
            code: discountForm.code.toUpperCase(),
            type: discountForm.type,
            value: parseFloat(discountForm.value),
            valueType: discountForm.valueType,
            startDate: discountForm.startDate,
            endDate: discountForm.endDate,
            minPurchase: parseFloat(discountForm.minPurchase) || 0,
            maxUses: parseInt(discountForm.maxUses) || 0,
          }
        : d
    );

    setDiscounts(updatedDiscounts);
    setIsEditDialogOpen(false);
    setSelectedDiscount(null);
    resetForm();
    toast.success('Discount updated successfully');
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(d => d.id !== id));
    toast.success('Discount deleted successfully');
  };

  const toggleStatus = (id: string) => {
    setDiscounts(discounts.map(d =>
      d.id === id
        ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' }
        : d
    ));
    toast.success('Discount status updated');
  };

  const openEditDialog = (discount: Discount) => {
    setSelectedDiscount(discount);
    setDiscountForm({
      code: discount.code,
      type: discount.type,
      value: discount.value.toString(),
      valueType: discount.valueType,
      startDate: discount.startDate,
      endDate: discount.endDate,
      minPurchase: discount.minPurchase.toString(),
      maxUses: discount.maxUses.toString()
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setDiscountForm({
      code: '',
      type: 'Coupon',
      value: '',
      valueType: 'Percentage',
      startDate: '',
      endDate: '',
      minPurchase: '',
      maxUses: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Coupon':
        return <Tag className="w-4 h-4" />;
      case 'Flash Sale':
        return <Clock className="w-4 h-4" />;
      case 'BOGO':
        return <Gift className="w-4 h-4" />;
      case 'Loyalty':
        return <Award className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Coupon':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Flash Sale':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'BOGO':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Loyalty':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Expired':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Discount Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage coupons, flash sales, and loyalty rewards
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Discount
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Discounts</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {discounts.filter(d => d.status === 'Active').length}
                </p>
              </div>
              <Tag className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Flash Sales</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {discounts.filter(d => d.type === 'Flash Sale').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">BOGO Offers</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {discounts.filter(d => d.type === 'BOGO').length}
                </p>
              </div>
              <Gift className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Uses</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  {discounts.reduce((sum, d) => sum + d.currentUses, 0)}
                </p>
              </div>
              <Award className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search discount codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 border-gray-300">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Coupon">Coupon</SelectItem>
                <SelectItem value="Flash Sale">Flash Sale</SelectItem>
                <SelectItem value="BOGO">BOGO</SelectItem>
                <SelectItem value="Loyalty">Loyalty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discounts Table */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Discounts ({filteredDiscounts.length})</CardTitle>
          <CardDescription className="text-gray-600">
            Manage promotional codes and special offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Discount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Validity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Usage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.map((discount) => (
                  <tr key={discount.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(discount.type)}
                        <span className="font-mono font-semibold text-gray-900">{discount.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getTypeColor(discount.type)} border`}>
                        {discount.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Percent className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {discount.valueType === 'Percentage'
                            ? `${discount.value}%`
                            : `₱${discount.value}`
                          }
                        </span>
                      </div>
                      {discount.minPurchase > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Min: ₱{discount.minPurchase}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{discount.startDate}</p>
                        <p className="text-gray-500">to {discount.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          {discount.currentUses} / {discount.maxUses || '∞'}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                              width: `${discount.maxUses ? (discount.currentUses / discount.maxUses) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(discount.status)} border`}>
                        {discount.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(discount.id)}
                          className="border-gray-300 text-gray-900"
                        >
                          {discount.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(discount)}
                          className="border-gray-300 text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Discount Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedDiscount(null);
          resetForm();
        }
      }}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {isAddDialogOpen ? 'Create Discount' : 'Edit Discount'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isAddDialogOpen ? 'Set up a new promotional offer' : 'Update discount details'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Discount Code *</Label>
                <Input
                  placeholder="SUMMER25"
                  value={discountForm.code}
                  onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                  className="border-gray-300 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Type *</Label>
                <Select value={discountForm.type} onValueChange={(v: any) => setDiscountForm({ ...discountForm, type: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coupon">Coupon</SelectItem>
                    <SelectItem value="Flash Sale">Flash Sale</SelectItem>
                    <SelectItem value="BOGO">BOGO</SelectItem>
                    <SelectItem value="Loyalty">Loyalty Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Discount Value *</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={discountForm.value}
                  onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Value Type *</Label>
                <Select value={discountForm.valueType} onValueChange={(v: any) => setDiscountForm({ ...discountForm, valueType: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage (%)</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount (₱)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Start Date *</Label>
                <Input
                  type="date"
                  value={discountForm.startDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">End Date *</Label>
                <Input
                  type="date"
                  value={discountForm.endDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Minimum Purchase (₱)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={discountForm.minPurchase}
                  onChange={(e) => setDiscountForm({ ...discountForm, minPurchase: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Maximum Uses</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={discountForm.maxUses}
                  onChange={(e) => setDiscountForm({ ...discountForm, maxUses: e.target.value })}
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              resetForm();
            }} className="border-gray-300">
              Cancel
            </Button>
            <Button
              onClick={isAddDialogOpen ? handleAddDiscount : handleEditDiscount}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isAddDialogOpen ? 'Create Discount' : 'Update Discount'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
