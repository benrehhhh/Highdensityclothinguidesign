import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Heart, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
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
} from '../../components/ui/dialog';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { getProducts, initStore, isWishlisted, subscribeStore, toggleWishlist, addToCart, refreshProducts } from '../../lib/data-store';
import { toast } from 'sonner';

export function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(() => {
    // Load from localStorage directly on initial render
    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      return products;
    } catch (error) {
      console.error("Failed to load products from localStorage:", error);
      return [];
    }
  });
  const focusSearch = searchParams.get("focusSearch") === "1";
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    initStore().catch(() => undefined);
    // Always read from localStorage when component mounts
    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      setProducts(products);
    } catch (error) {
      console.error("Failed to load products from localStorage:", error);
    }

    // Listen for localStorage changes to products
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'products') {
        refreshProducts();
        try {
          const products = JSON.parse(localStorage.getItem('products') || '[]');
          setProducts(products);
        } catch (error) {
          console.error("Failed to load products from localStorage:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = !product.status || product.status === 'Active';
    
    let matchesPrice = true;
    if (priceFilter === 'under1000') matchesPrice = product.price < 1000;
    else if (priceFilter === '1000-1500') matchesPrice = product.price >= 1000 && product.price <= 1500;
    else if (priceFilter === 'over1500') matchesPrice = product.price > 1500;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">Shop All Products</h1>
          <p className="text-[#8B7355]">Discover our handcrafted collection</p>
        </div>

        <Card className="border-[#B7885E]/20 bg-white shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B7355]" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#B7885E]/20"
                  autoFocus={focusSearch}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-[#B7885E]/20"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Tops">Tops</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="border-[#B7885E]/20"><SelectValue placeholder="Price Range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under1000">Under ₱1,000</SelectItem>
                  <SelectItem value="1000-1500">₱1,000 - ₱1,500</SelectItem>
                  <SelectItem value="over1500">Over ₱1,500</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-[#B7885E]/20"><SelectValue placeholder="Sort By" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all group overflow-hidden cursor-pointer" onClick={() => navigate(`/home/product/${String(product.id)}`)}>
              <div className="relative aspect-square overflow-hidden bg-[#f5ede0]">
                <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform">
                  <Button 
                    className="w-full bg-[#B7885E] hover:bg-[#3B2C24] text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setSelectedSize(product.sizes?.[0] || 'M');
                      setSelectedColor(product.colors?.[0] || 'Beige');
                      setSelectedQuantity(1);
                      setIsModalOpen(true);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
                <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={async (e) => { e.stopPropagation(); await toggleWishlist(product.id); }} className="bg-white/90 hover:bg-white text-[#3B2C24]">
                    <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-current text-[#B7885E]" : ""}`} />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-[#3B2C24] mb-1">{product.name}</h3>
                <p className="text-xs text-[#8B7355] mb-2">{product.category}</p>
                <p className="text-xl font-semibold text-[#B7885E]">₱{product.price.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Product Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProduct && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.sizes?.map((size: string) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Color</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProduct.colors?.map((color: string) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (selectedProduct) {
                    await addToCart({
                      productId: selectedProduct.id,
                      name: selectedProduct.name,
                      price: selectedProduct.price,
                      size: selectedSize || selectedProduct.sizes?.[0] || 'M',
                      color: selectedColor || selectedProduct.colors?.[0] || 'Beige',
                      quantity: selectedQuantity,
                      image: selectedProduct.image
                    });
                    toast.success(`${selectedProduct.name} added to cart!`);
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                    setSelectedSize('');
                    setSelectedColor('');
                    setSelectedQuantity(1);
                  }
                }}
                disabled={!selectedProduct || !selectedSize || !selectedColor}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
