import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Download,
  Filter
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
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
}

const categories = ['Men', 'Women', 'Kids', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#001f3f' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0074D9' },
  { name: 'Green', hex: '#2ECC40' },
  { name: 'Brown', hex: '#8B4513' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    category: 'Men',
    price: 1299,
    discount: 10,
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    images: [],
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Linen Summer Dress',
    category: 'Women',
    price: 2499,
    discount: 0,
    stock: 30,
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Blue'],
    images: [],
    description: 'Lightweight linen dress for summer',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Kids Hoodie',
    category: 'Kids',
    price: 899,
    discount: 15,
    stock: 0,
    sizes: ['XS', 'S', 'M'],
    colors: ['Gray', 'Navy', 'Red'],
    images: [],
    description: 'Warm and cozy hoodie for kids',
    status: 'Out of Stock'
  },
];

export function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    discount: '0',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
    description: '',
    status: 'Active' as 'Active' | 'Draft' | 'Out of Stock'
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.category || !productForm.price || !productForm.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      category: productForm.category,
      price: parseFloat(productForm.price),
      discount: parseFloat(productForm.discount),
      stock: parseInt(productForm.stock),
      sizes: productForm.sizes,
      colors: productForm.colors,
      images: [],
      description: productForm.description,
      status: productForm.status
    };

    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Product added successfully');
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: productForm.name,
            category: productForm.category,
            price: parseFloat(productForm.price),
            discount: parseFloat(productForm.discount),
            stock: parseInt(productForm.stock),
            sizes: productForm.sizes,
            colors: productForm.colors,
            description: productForm.description,
            status: productForm.status
          }
        : p
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    resetForm();
    toast.success('Product updated successfully');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      discount: product.discount.toString(),
      stock: product.stock.toString(),
      sizes: product.sizes,
      colors: product.colors,
      description: product.description,
      status: product.status
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      category: '',
      price: '',
      discount: '0',
      stock: '',
      sizes: [],
      colors: [],
      description: '',
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

  const handleBulkUpload = () => {
    toast.success('CSV uploaded and products imported successfully');
    setIsBulkUploadOpen(false);
  };

  const downloadCSVTemplate = () => {
    const csv = 'Name,Category,Price,Discount,Stock,Sizes,Colors,Description,Status\nSample Product,Men,1299,10,50,"S,M,L","Black,White",Description here,Active';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-template.csv';
    a.click();
    toast.success('Template downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Out of Stock':
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
          <h1 className="text-3xl font-semibold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog, pricing, and inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsBulkUploadOpen(true)}
            className="border-gray-300 text-gray-900 hover:bg-gray-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{products.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-3xl font-semibold text-green-600 mt-1">
                {products.filter(p => p.status === 'Active').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-semibold text-red-600 mt-1">
                {products.filter(p => p.status === 'Out of Stock').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">
                ₱{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
              </p>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48 border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Products ({filteredProducts.length})</CardTitle>
          <CardDescription className="text-gray-600">
            Manage product details, pricing, and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.sizes.join(', ')} • {product.colors.length} colors
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">₱{product.price.toLocaleString()}</p>
                        {product.discount > 0 && (
                          <p className="text-sm text-green-600">{product.discount}% off</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={product.stock > 10 ? 'text-gray-900' : 'text-red-600'}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(product.status)} border`}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          className="border-gray-300 text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedProduct(null);
          resetForm();
        }
      }}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {isAddDialogOpen ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isAddDialogOpen ? 'Create a new product listing' : 'Update product information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Product Name *</Label>
                <Input
                  placeholder="e.g., Cotton T-Shirt"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Category *</Label>
                <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900">Price (₱) *</Label>
                <Input
                  type="number"
                  placeholder="1299"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Discount (%)</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={productForm.discount}
                  onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900">Stock *</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="border-gray-300"
                />
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Sizes */}
            <div className="space-y-2">
              <Label className="text-gray-900">Available Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      productForm.sizes.includes(size)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <Label className="text-gray-900">Available Colors</Label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map(color => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      productForm.colors.includes(color.name)
                        ? 'bg-gray-100 border-gray-900'
                        : 'bg-white border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm text-gray-900">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-gray-900">Description</Label>
              <Textarea
                placeholder="Product description..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="border-gray-300 resize-none"
                rows={4}
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-gray-900">Product Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-900 transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB (Multiple images supported)</p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-gray-900">Status</Label>
              <Select value={productForm.status} onValueChange={(v: any) => setProductForm({ ...productForm, status: v })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
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
              onClick={isAddDialogOpen ? handleAddProduct : handleEditProduct}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isAddDialogOpen ? 'Add Product' : 'Update Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Bulk Upload Products</DialogTitle>
            <DialogDescription className="text-gray-600">
              Upload multiple products using CSV file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Instructions:</strong>
              </p>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Download the CSV template</li>
                <li>Fill in your product data</li>
                <li>Upload the completed CSV file</li>
              </ol>
            </div>

            <Button
              variant="outline"
              onClick={downloadCSVTemplate}
              className="w-full border-gray-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-900 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Click to upload CSV file</p>
              <p className="text-xs text-gray-500">CSV files only, max 5MB</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button onClick={handleBulkUpload} className="bg-gray-900 hover:bg-gray-800 text-white">
              Upload Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
