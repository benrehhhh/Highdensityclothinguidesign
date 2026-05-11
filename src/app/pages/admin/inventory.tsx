import { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Filter,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2
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
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { adminApi } from '../../lib/admin-api';
import { toast } from 'sonner';

export function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [clothingTypeFilter, setClothingTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newStock, setNewStock] = useState(0);
  const [newItem, setNewItem] = useState({
    name: '',
    gender: '',
    clothingType: '',
    stock: 0,
    price: 0,
    reorder_point: 10,
    image: '',
    imageFile: null as File | null,
    sizes: [] as string[],
    colors: [] as string[]
  });

  const genders = ['Men', 'Women', 'Kids', 'Unisex'];
  const clothingTypes = ['Tops', 'Outerwear', 'Bottoms', 'Accessories'];

  const sizesByClothingType: Record<string, string[]> = {
    'Tops': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Outerwear': ['S', 'M', 'L', 'XL', 'XXL'],
    'Bottoms': ['28', '30', '32', '34', '36', '38'],
    'Accessories': ['One Size']
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const itemGender = item.category?.split(' - ')[0] || '';
    const itemClothingType = item.category?.split(' - ')[1] || '';
    const matchesGender = genderFilter === 'all' || itemGender === genderFilter;
    const matchesClothingType = clothingTypeFilter === 'all' || itemClothingType === clothingTypeFilter;
    const itemStatus = item.stock <= item.reorder_point ? 'Low Stock' : 'In Stock';
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;
    return matchesSearch && matchesGender && matchesClothingType && matchesStatus;
  });

  const loadInventory = async () => {
    try {
      const data = await adminApi.getInventory();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load inventory");
    }
  };

  useEffect(() => {
    loadInventory();

    // Listen for localStorage changes for real-time stock updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userOrders' || e.key === 'inventory') {
        loadInventory();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleUpdateStock = async () => {
    if (!selectedItem) return;
    try {
      await adminApi.updateInventory(selectedItem.id, newStock);
      toast.success("Stock updated successfully");
      setIsUpdateDialogOpen(false);
      loadInventory();
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const handleAddItem = async () => {
    try {
      const category = `${newItem.gender} - ${newItem.clothingType}`;
      const newInventoryItem = {
        name: newItem.name,
        category: category,
        price: newItem.price,
        stock: newItem.stock,
        sizes: newItem.sizes,
        colors: newItem.colors,
        image: newItem.image,
        description: '',
        materials: '',
        care: '',
        status: 'Draft'
      };
      await adminApi.createProduct(newInventoryItem);
      toast.success("Item added successfully");
      setIsAddDialogOpen(false);
      setNewItem({
        name: '',
        gender: '',
        clothingType: '',
        stock: 0,
        price: 0,
        reorder_point: 10,
        image: '',
        imageFile: null,
        sizes: [],
        colors: []
      });
      loadInventory();
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      await adminApi.deleteProduct(selectedItem.id);
      toast.success("Item deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
      loadInventory();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const lowStockCount = items.filter(item => item.stock <= item.reorder_point).length;
  const totalStockValue = items.reduce((sum, item) => sum + (item.stock * (item.price || 0)), 0);

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
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#B7885E] hover:bg-[#9d7350] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
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
                  ₱{totalStockValue.toLocaleString()}
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
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#B7885E]/20"
              />
            </div>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="border-[#B7885E]/20">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {genders.map((g: string) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={clothingTypeFilter} onValueChange={setClothingTypeFilter}>
              <SelectTrigger className="border-[#B7885E]/20">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {clothingTypes.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3B2C24]">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[#3B2C24]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-[#B7885E]/10 hover:bg-[#FFF5E6]/50 transition-colors ${
                      item.stock <= item.reorder_point ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} className="w-10 h-10 object-cover rounded-lg" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <div className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                        <span className="text-sm font-medium text-[#3B2C24]">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8B7355]">{item.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-medium ${
                        item.stock <= item.reorder_point ? 'text-red-600' : 'text-[#3B2C24]'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={
                          item.stock <= item.reorder_point 
                            ? 'bg-red-100 text-red-700 hover:bg-red-100' 
                            : 'bg-green-100 text-green-700 hover:bg-green-100'
                        }
                      >
                        {item.stock <= item.reorder_point ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setNewStock(item.stock);
                            setIsUpdateDialogOpen(true);
                          }}
                          className="text-[#B7885E] hover:text-[#9d7350] hover:bg-[#FFF5E6]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
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

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Update Stock: {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>New Stock Level</Label>
            <Input 
              type="number" 
              value={newStock} 
              onChange={(e) => setNewStock(parseInt(e.target.value))}
              className="mt-2 border-[#B7885E]/20"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#B7885E] text-white" onClick={handleUpdateStock}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label>Product Image *</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewItem({ ...newItem, imageFile: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewItem(prev => ({ ...prev, image: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {newItem.image && (
                  <img src={newItem.image} alt="Preview" className="w-20 h-20 object-cover rounded-md border" />
                )}
              </div>
            </div>
            <div>
              <Label>Product Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="mt-2 border-[#B7885E]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <Select value={newItem.gender} onValueChange={(v) => setNewItem({ ...newItem, gender: v })}>
                  <SelectTrigger className="mt-2 border-[#B7885E]/20">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((g: string) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Clothing Type</Label>
                <Select value={newItem.clothingType} onValueChange={(v) => setNewItem({ ...newItem, clothingType: v, sizes: [] })}>
                  <SelectTrigger className="mt-2 border-[#B7885E]/20">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {clothingTypes.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) })}
                  className="mt-2 border-[#B7885E]/20"
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  className="mt-2 border-[#B7885E]/20"
                />
              </div>
            </div>
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(sizesByClothingType[newItem.clothingType] || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setNewItem(prev => ({
                        ...prev,
                        sizes: prev.sizes.includes(size)
                          ? prev.sizes.filter(s => s !== size)
                          : [...prev.sizes, size]
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                      newItem.sizes.includes(size)
                        ? 'bg-[#B7885E] text-white border-[#B7885E]'
                        : 'bg-white border-[#B7885E]/20 hover:border-[#B7885E]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Colors</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[
                  { name: 'Black', hex: '#000000' },
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Beige', hex: '#F5F5DC' },
                  { name: 'Brown', hex: '#8B4513' },
                  { name: 'Navy', hex: '#000080' },
                  { name: 'Cream', hex: '#FFFDD0' }
                ].map(color => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setNewItem(prev => ({
                        ...prev,
                        colors: prev.colors.includes(color.name)
                          ? prev.colors.filter(c => c !== color.name)
                          : [...prev.colors, color.name]
                      }));
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-xs transition-colors ${
                      newItem.colors.includes(color.name)
                        ? 'border-[#B7885E] bg-[#B7885E]/10'
                        : 'bg-white border-[#B7885E]/20 hover:border-[#B7885E]'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.hex }} /> {color.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Reorder Point</Label>
              <Input
                type="number"
                value={newItem.reorder_point}
                onChange={(e) => setNewItem({ ...newItem, reorder_point: parseInt(e.target.value) })}
                className="mt-2 border-[#B7885E]/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#B7885E] text-white" onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-red-500 text-white hover:bg-red-600" onClick={handleDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
