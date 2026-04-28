import { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Filter,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { adminApi } from '../../lib/admin-api';

const inventoryItems = [
  {
    id: 1,
    name: 'Handcrafted Cotton Shirt',
    category: 'Shirts',
    stock: 15,
    variants: 'XS, S, M, L, XL',
    cost: 1299,
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Linen Casual Polo',
    category: 'Polos',
    stock: 8,
    variants: 'S, M, L, XL',
    cost: 1599,
    status: 'Low Stock'
  },
  {
    id: 3,
    name: 'Premium Cotton Jacket',
    category: 'Jackets',
    stock: 22,
    variants: 'M, L, XL, XXL',
    cost: 2499,
    status: 'In Stock'
  },
  {
    id: 4,
    name: 'Embroidered T-Shirt',
    category: 'Shirts',
    stock: 3,
    variants: 'XS, S, M, L',
    cost: 899,
    status: 'Low Stock'
  },
  {
    id: 5,
    name: 'Classic Button-Down',
    category: 'Shirts',
    stock: 18,
    variants: 'S, M, L, XL',
    cost: 1199,
    status: 'In Stock'
  },
  {
    id: 6,
    name: 'Woven Fabric Vest',
    category: 'Vests',
    stock: 12,
    variants: 'M, L, XL',
    cost: 1799,
    status: 'In Stock'
  },
  {
    id: 7,
    name: 'Hemp Blend Shirt',
    category: 'Shirts',
    stock: 2,
    variants: 'S, M, L',
    cost: 1399,
    status: 'Low Stock'
  },
  {
    id: 8,
    name: 'Artisan Hoodie',
    category: 'Hoodies',
    stock: 25,
    variants: 'S, M, L, XL, XXL',
    cost: 2199,
    status: 'In Stock'
  },
];

export function Inventory() {
  const [items, setItems] = useState(inventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = items.filter(item => item.status === 'Low Stock').length;

  useEffect(() => {
    adminApi.getInventory().then(setItems).catch(() => undefined);
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#3B2C24]">Inventory Management</h1>
          <p className="text-[#8B7355] mt-1">
            Manage your product stock and variants
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#3B2C24]">Add New Product</DialogTitle>
              <DialogDescription className="text-[#8B7355]">
                Enter the details of the new product to add to inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Product Name</Label>
                <Input placeholder="e.g., Cotton Shirt" className="border-[#B7885E]/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Category</Label>
                <Select>
                  <SelectTrigger className="border-[#B7885E]/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="polos">Polos</SelectItem>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="hoodies">Hoodies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Stock Count</Label>
                  <Input type="number" placeholder="0" className="border-[#B7885E]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#3B2C24]">Price (₱)</Label>
                  <Input type="number" placeholder="0.00" className="border-[#B7885E]/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Available Variants</Label>
                <Input placeholder="e.g., S, M, L, XL" className="border-[#B7885E]/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#3B2C24]">Description</Label>
                <Textarea 
                  placeholder="Product description..." 
                  className="border-[#B7885E]/20 resize-none" 
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="border-[#B7885E]/20"
              >
                Cancel
              </Button>
              <Button 
                className="bg-[#B7885E] hover:bg-[#9d7350] text-white"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">Total Products</p>
                <p className="text-3xl font-semibold text-[#3B2C24] mt-1">
                  {items.length}
                </p>
              </div>
              <Package className="w-12 h-12 text-[#B7885E] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">Low Stock Items</p>
                <p className="text-3xl font-semibold text-red-600 mt-1">
                  {lowStockCount}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#B7885E]/20 bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8B7355]">Total Stock Value</p>
                <p className="text-3xl font-semibold text-[#B7885E] mt-1">
                  ₱{items.reduce((sum, item) => sum + (item.stock * item.cost), 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-[#B7885E] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-[#B7885E]/20 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
            <Filter className="w-5 h-5 text-[#B7885E]" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#B7885E]/20"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-[#B7885E]/20">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Shirts">Shirts</SelectItem>
                <SelectItem value="Polos">Polos</SelectItem>
                <SelectItem value="Jackets">Jackets</SelectItem>
                <SelectItem value="Hoodies">Hoodies</SelectItem>
                <SelectItem value="Vests">Vests</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-[#B7885E]/20">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-[#B7885E]/20 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#3B2C24]">
            <Package className="w-5 h-5 text-[#B7885E]" />
            Product List
          </CardTitle>
          <CardDescription className="text-[#8B7355]">
            {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B7885E]/20">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3B2C24]">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3B2C24]">Category</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[#3B2C24]">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3B2C24]">Variants</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3B2C24]">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3B2C24]">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[#3B2C24]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-[#B7885E]/10 hover:bg-[#FFF5E6]/50 transition-colors ${
                      item.status === 'Low Stock' ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f5ede0] rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#B7885E]" />
                        </div>
                        <span className="text-sm font-medium text-[#3B2C24]">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8B7355]">{item.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-medium ${
                        item.status === 'Low Stock' ? 'text-red-600' : 'text-[#3B2C24]'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8B7355]">{item.variants}</td>
                    <td className="py-3 px-4 text-sm font-medium text-[#B7885E]">₱{item.cost.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          item.status === 'Low Stock' 
                            ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                            : 'bg-green-100 text-green-700 hover:bg-green-100'
                        }
                      >
                        {item.status === 'Low Stock' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-[#B7885E] hover:text-[#9d7350] hover:bg-[#FFF5E6]"
                        >
                          <Edit className="w-4 h-4" />
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
    </div>
  );
}
