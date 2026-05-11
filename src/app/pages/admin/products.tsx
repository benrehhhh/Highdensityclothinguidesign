import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { adminApi } from '../../lib/admin-api';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  sizes: string[];
  colors: string[];
  image: string;
  description: string;
  materials: string;
  care: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
}

const genders = ['Men', 'Women', 'Kids', 'Unisex'];
const clothingTypes = ['Tops', 'Outerwear', 'Bottoms', 'Accessories'];
const categories = ['Men', 'Women', 'Kids', 'Unisex', 'Tops', 'Outerwear', 'Bottoms', 'Accessories'];

const sizesByClothingType: Record<string, string[]> = {
  'Tops': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  'Outerwear': ['S', 'M', 'L', 'XL', 'XXL'],
  'Bottoms': ['28', '30', '32', '34', '36', '38'],
  'Accessories': ['One Size']
};

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Cream', hex: '#FFFDD0' }
];

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    gender: '',
    clothingType: '',
    price: '',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
    description: '',
    materials: '',
    care: '',
    image: '',
    imageFile: null as File | null,
    status: 'Active' as 'Active' | 'Draft' | 'Out of Stock'
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const refreshProductsList = async () => {
    try {
      const items = await adminApi.getProducts();
      const mappedItems = items.map((item) => ({ 
        ...item, 
        id: String(item.id), 
        status: item.stock > 0 ? (item.status || "Active") : "Out of Stock"
      }));
      setProducts(mappedItems);
      
      // Sync to localStorage
      localStorage.setItem('products', JSON.stringify(mappedItems));
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };

  useEffect(() => {
    refreshProductsList();
  }, []);

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.gender || !productForm.clothingType || !productForm.price || !productForm.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...productForm,
        category: `${productForm.gender} - ${productForm.clothingType}`,
        price: parseFloat(productForm.price),
        originalPrice: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      };

      const newProduct = await adminApi.createProduct(payload);
      
      // Sync to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      existingProducts.push(newProduct);
      localStorage.setItem('products', JSON.stringify(existingProducts));
      
      await refreshProductsList();
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Product added successfully');
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    try {
      const payload = {
        ...productForm,
        category: `${productForm.gender} - ${productForm.clothingType}`,
        price: parseFloat(productForm.price),
        originalPrice: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      };

      const updatedProduct = await adminApi.updateProduct(selectedProduct.id, payload);
      
      // Sync to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const index = existingProducts.findIndex((p: any) => p.id === selectedProduct.id);
      if (index !== -1) {
        existingProducts[index] = updatedProduct;
        localStorage.setItem('products', JSON.stringify(existingProducts));
      }
      
      await refreshProductsList();
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await adminApi.deleteProduct(selectedProduct.id);
      
      // Sync to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const filteredProducts = existingProducts.filter((p: any) => p.id !== selectedProduct.id);
      localStorage.setItem('products', JSON.stringify(filteredProducts));
      
      await refreshProductsList();
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleStatusChange = async (id: string, status: 'Active' | 'Draft' | 'Out of Stock') => {
    try {
      await adminApi.updateProduct(id, { status });
      
      // Sync to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const index = existingProducts.findIndex((p: any) => p.id === id);
      if (index !== -1) {
        existingProducts[index].status = status;
        localStorage.setItem('products', JSON.stringify(existingProducts));
      }
      
      await refreshProductsList();
      toast.success('Product status updated successfully');
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const openEditDialog = (product: Product) => {
    const categoryParts = product.category?.split(' - ') || ['', ''];
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      gender: categoryParts[0] || '',
      clothingType: categoryParts[1] || '',
      price: product.price.toString(),
      stock: (product.stock || 0).toString(),
      sizes: product.sizes || [],
      colors: product.colors || [],
      description: product.description || '',
      materials: product.materials || '',
      care: product.care || '',
      image: product.image || '',
      imageFile: null,
      status: product.status
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      gender: '',
      clothingType: '',
      price: '',
      stock: '',
      sizes: [],
      colors: [],
      description: '',
      materials: '',
      care: '',
      image: '',
      imageFile: null,
      status: 'Active'
    });
  };

  const toggleSize = (size: string) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (color: string) => {
    setProductForm(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Out of Stock': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your handcrafted product catalog</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="pt-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 border-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} className="w-10 h-10 object-cover rounded-md bg-gray-100" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <div className="w-10 h-10 object-cover rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sizes.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-sm font-medium">₱{product.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.stock} units</td>
                    <td className="py-3 px-4">
                      <Select 
                        value={product.status} 
                        onValueChange={(value: 'Active' | 'Draft' | 'Out of Stock') => handleStatusChange(product.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) { setIsAddDialogOpen(false); setIsEditDialogOpen(false); setSelectedProduct(null); resetForm(); }
      }}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Product Image *</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProductForm({ ...productForm, imageFile: file });
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProductForm(prev => ({ ...prev, image: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {productForm.image && (
                  <img src={productForm.image} alt="Preview" className="w-24 h-24 object-cover rounded-md border" />
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select value={productForm.gender} onValueChange={(v) => setProductForm({ ...productForm, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>{genders.map((g: string) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Clothing Type *</Label>
              <Select value={productForm.clothingType} onValueChange={(v) => setProductForm({ ...productForm, clothingType: v, sizes: [] })}>
                <SelectTrigger><SelectValue placeholder="Select clothing type" /></SelectTrigger>
                <SelectContent>{clothingTypes.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Price (₱) *</Label><Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} /></div>
              <div className="space-y-2"><Label>Stock *</Label><Input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {(sizesByClothingType[productForm.clothingType] || sizes).map(size => (
                  <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${productForm.sizes.includes(size) ? 'bg-gray-900 text-white' : 'bg-white hover:border-gray-900'}`}>{size}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map(color => (
                  <button key={color.name} type="button" onClick={() => toggleColor(color.name)} className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-xs transition-colors ${productForm.colors.includes(color.name) ? 'border-gray-900 bg-gray-50' : 'bg-white hover:border-gray-900'}`}>
                    <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.hex }} /> {color.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={isAddDialogOpen ? handleAddProduct : handleEditProduct} className="bg-gray-900 text-white">{isAddDialogOpen ? 'Add Product' : 'Update Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-red-500 text-white hover:bg-red-600" onClick={confirmDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
