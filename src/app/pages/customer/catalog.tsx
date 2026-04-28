import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
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
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { getProducts, initStore, isWishlisted, subscribeStore, toggleWishlist } from '../../lib/data-store';
import { toast } from 'sonner';

export function Catalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(getProducts());
  const focusSearch = searchParams.get("focusSearch") === "1";
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    initStore().catch(() => undefined);
    return subscribeStore(() => setProducts(getProducts()));
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    let matchesPrice = true;
    if (priceFilter === 'under1000') matchesPrice = product.price < 1000;
    else if (priceFilter === '1000-1500') matchesPrice = product.price >= 1000 && product.price <= 1500;
    else if (priceFilter === 'over1500') matchesPrice = product.price > 1500;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#3B2C24] mb-2">Shop All Products</h1>
          <p className="text-[#8B7355]">Discover our handcrafted collection</p>
        </div>

        {/* Filters */}
        <Card className="border-[#B7885E]/20 bg-white shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-5 gap-4">
              {/* Search */}
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

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-[#B7885E]/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Tops">Tops</SelectItem>
                  <SelectItem value="Bottoms">Bottoms</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="border-[#B7885E]/20">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under1000">Under ₱1,000</SelectItem>
                  <SelectItem value="1000-1500">₱1,000 - ₱1,500</SelectItem>
                  <SelectItem value="over1500">Over ₱1,500</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-[#B7885E]/20">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[#8B7355]">
            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
          </p>
          <Button variant="outline" size="sm" className="border-[#B7885E]/20 text-[#3B2C24]">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card
              key={product.id}
              className="border-[#B7885E]/20 shadow-lg hover:shadow-xl transition-all group overflow-hidden cursor-pointer"
              onClick={() => navigate(`/home/product/${product.id}`)}
            >
              <div className="relative aspect-square overflow-hidden bg-[#f5ede0]">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.badge && (
                  <Badge className="absolute top-3 right-3 bg-[#B7885E] text-white hover:bg-[#B7885E]">
                    {product.badge}
                  </Badge>
                )}
                
                {/* Quick Actions */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      await toggleWishlist(product.id);
                      toast.success(isWishlisted(product.id) ? "Added to wishlist!" : "Removed from wishlist");
                    }}
                    className="bg-white/90 hover:bg-white text-[#3B2C24]"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-current text-[#B7885E]" : ""}`} />
                  </Button>
                  <Link to={`/home/product/${product.id}`}>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(event) => event.stopPropagation()}
                      className="bg-white/90 hover:bg-white text-[#3B2C24]"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-white">Out of Stock</Badge>
                  </div>
                )}
              </div>

              <CardContent className="pt-4">
                <Link to={`/home/product/${product.id}`} onClick={(event) => event.stopPropagation()}>
                  <h3 className="font-semibold text-[#3B2C24] mb-1 hover:text-[#B7885E] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-[#8B7355] mb-2">{product.category}</p>
                
                {/* Sizes */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.sizes.slice(0, 4).map((size) => (
                    <span key={size} className="px-2 py-0.5 text-xs border border-[#B7885E]/20 rounded">
                      {size}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-[#8B7355]">+{product.sizes.length - 4}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-[#B7885E]">
                    ₱{product.price.toLocaleString()}
                  </span>
                  <Link to={`/home/product/${product.id}`} onClick={(event) => event.stopPropagation()}>
                    <Button size="sm" className="bg-[#B7885E] hover:bg-[#9d7350] text-white">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <Card className="border-[#B7885E]/20 bg-white shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-[#8B7355]">No products found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setPriceFilter('all');
                }}
                className="mt-4 bg-[#B7885E] hover:bg-[#9d7350] text-white"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
