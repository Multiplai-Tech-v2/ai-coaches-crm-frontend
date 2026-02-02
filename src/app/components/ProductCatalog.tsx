import { useState } from 'react';
import { Package, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { mockProducts, Product } from '@/app/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Workshops',
    status: 'Active',
    pricing: {
      model: 'Per Event',
      amount: 0,
      currency: 'USD',
    },
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Workshops':
        return 'bg-blue-100 text-blue-700';
      case 'AI Consulting':
        return 'bg-purple-100 text-purple-700';
      case 'Software':
        return 'bg-green-100 text-green-700';
      case 'Certifications':
        return 'bg-orange-100 text-orange-700';
      case 'Embedded Teams':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Coming Soon':
        return 'bg-yellow-100 text-yellow-700';
      case 'Archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSaveNewProduct = () => {
    if (!newProduct.name || !newProduct.code || !newProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    const productToAdd: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name || '',
      code: newProduct.code || '',
      category: newProduct.category as Product['category'],
      description: newProduct.description || '',
      pricing: {
        model: newProduct.pricing?.model || 'Per Event',
        amount: newProduct.pricing?.amount || 0,
        currency: newProduct.pricing?.currency || 'USD',
        billingFrequency: newProduct.pricing?.billingFrequency,
      },
      status: newProduct.status as Product['status'] || 'Active',
    };

    setProducts([...products, productToAdd]);
    setIsNewProductDialogOpen(false);
    
    // Reset form
    setNewProduct({
      category: 'Workshops',
      status: 'Active',
      pricing: {
        model: 'Per Event',
        amount: 0,
        currency: 'USD',
      },
    });
  };

  const getPricingModelOptions = (category: string) => {
    switch (category) {
      case 'Workshops':
        return [
          { value: 'Per Participant (Public)', label: 'Per Participant (Public)' },
          { value: 'Flat Fee (Private)', label: 'Flat Fee (Private)' },
          { value: 'Per Event', label: 'Per Event' },
        ];
      case 'AI Consulting':
        return [
          { value: 'Monthly Retainer', label: 'Monthly Retainer' },
          { value: 'Hourly Rate', label: 'Hourly Rate' },
          { value: 'Project-Based', label: 'Project-Based' },
        ];
      case 'Software':
        return [
          { value: 'Per Seat Monthly', label: 'Per Seat Monthly' },
          { value: 'Per Seat Annual', label: 'Per Seat Annual' },
          { value: 'Enterprise Tier', label: 'Enterprise Tier' },
        ];
      case 'Certifications':
        return [
          { value: 'Certification Fee', label: 'Certification Fee' },
          { value: 'Annual Renewal', label: 'Annual Renewal' },
          { value: 'Re-examination Fee', label: 'Re-examination Fee' },
        ];
      case 'Embedded Teams':
        return [
          { value: 'Monthly Rate', label: 'Monthly Rate' },
          { value: 'Quarterly Rate', label: 'Quarterly Rate' },
          { value: 'Annual Rate', label: 'Annual Rate' },
        ];
      default:
        return [{ value: 'Custom', label: 'Custom' }];
    }
  };

  // Group products by category
  const categories = ['Workshops', 'AI Consulting', 'Software', 'Certifications', 'Embedded Teams'];
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category] = products.filter(p => p.category === category && p.status === 'Active');
    return acc;
  }, {} as Record<string, typeof mockProducts>);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="text-gray-500 mt-1">Manage AiCoaches service offerings and pricing</p>
          </div>
          <Button onClick={() => setIsNewProductDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Workshops">Workshops</SelectItem>
              <SelectItem value="AI Consulting">AI Consulting</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Certifications">Certifications</SelectItem>
              <SelectItem value="Embedded Teams">Embedded Teams</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Coming Soon">Coming Soon</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {categories.map(category => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{productsByCategory[category].length}</p>
              <p className="text-xs text-gray-500 mt-1">Active products</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="consulting">AI Consulting</TabsTrigger>
          <TabsTrigger value="software">Software</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="teams">Embedded Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.code}</p>
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Pricing Model</p>
                      <p className="text-sm font-medium text-gray-900">{product.pricing.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ${product.pricing.amount.toLocaleString()} {product.pricing.currency}
                      </p>
                    </div>
                    {product.pricing.billingFrequency && (
                      <div>
                        <p className="text-xs text-gray-500">Billing</p>
                        <p className="text-sm font-medium text-gray-900">{product.pricing.billingFrequency}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshops">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProducts.filter(p => p.category === 'Workshops').map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.code}</p>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pricing</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${product.pricing.amount.toLocaleString()} / participant
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consulting">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProducts.filter(p => p.category === 'AI Consulting').map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.code}</p>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Retainer</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${product.pricing.amount.toLocaleString()} / month
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="software">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProducts.filter(p => p.category === 'Software').map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.code}</p>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Subscription</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${product.pricing.amount} / seat / month
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProducts.filter(p => p.category === 'Certifications').map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.code}</p>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Certification Fee</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${product.pricing.amount.toLocaleString()} / candidate
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProducts.filter(p => p.category === 'Embedded Teams').map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.code}</p>
                  </div>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${product.pricing.amount.toLocaleString()} / month
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* New Product Dialog */}
      <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product offering for the AiCoaches catalog. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Strategic AI Roadmap Workshop"
                      value={newProduct.name || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Product Code / SKU <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="code"
                      placeholder="e.g., WS-ROADMAP-001"
                      value={newProduct.code || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => {
                        const pricingModel = getPricingModelOptions(value)[0]?.value || 'Custom';
                        setNewProduct({ 
                          ...newProduct, 
                          category: value,
                          pricing: {
                            ...newProduct.pricing,
                            model: pricingModel,
                          }
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshops">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Workshops
                          </div>
                        </SelectItem>
                        <SelectItem value="AI Consulting">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            AI Consulting
                          </div>
                        </SelectItem>
                        <SelectItem value="Software">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Software
                          </div>
                        </SelectItem>
                        <SelectItem value="Certifications">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Certifications
                          </div>
                        </SelectItem>
                        <SelectItem value="Embedded Teams">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            Embedded Teams
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status
                    </Label>
                    <Select
                      value={newProduct.status}
                      onValueChange={(value) => setNewProduct({ ...newProduct, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Coming Soon">Coming Soon</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the product, including key features, benefits, and target audience..."
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    This description will be visible on proposals and marketing materials.
                  </p>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Pricing Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricingModel" className="text-sm font-medium">
                      Pricing Model <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newProduct.pricing?.model}
                      onValueChange={(value) => 
                        setNewProduct({ 
                          ...newProduct, 
                          pricing: { ...newProduct.pricing, model: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent>
                        {getPricingModelOptions(newProduct.category as string).map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricingCurrency" className="text-sm font-medium">
                      Currency
                    </Label>
                    <Select
                      value={newProduct.pricing?.currency}
                      onValueChange={(value) => 
                        setNewProduct({ 
                          ...newProduct, 
                          pricing: { ...newProduct.pricing, currency: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricingAmount" className="text-sm font-medium">
                      Amount <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="pricingAmount"
                        type="number"
                        placeholder="0.00"
                        value={newProduct.pricing?.amount || ''}
                        onChange={(e) => 
                          setNewProduct({ 
                            ...newProduct, 
                            pricing: { 
                              ...newProduct.pricing, 
                              amount: parseFloat(e.target.value) || 0 
                            } 
                          })
                        }
                        className="pl-8"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingFrequency" className="text-sm font-medium">
                      Billing Frequency
                      <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                    </Label>
                    <Input
                      id="billingFrequency"
                      placeholder="e.g., Monthly, Annual, Per Event"
                      value={newProduct.pricing?.billingFrequency || ''}
                      onChange={(e) => 
                        setNewProduct({ 
                          ...newProduct, 
                          pricing: { 
                            ...newProduct.pricing, 
                            billingFrequency: e.target.value 
                          } 
                        })
                      }
                    />
                  </div>
                </div>

                {/* Category-specific helper text */}
                {newProduct.category === 'Workshops' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Workshop pricing tips:</strong> Consider offering both public (per-participant) and private (flat fee) options. 
                      Typical range: $500-$2,000 per participant for public workshops.
                    </p>
                  </div>
                )}
                {newProduct.category === 'AI Consulting' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-xs text-purple-800">
                      <strong>Consulting pricing tips:</strong> Monthly retainers typically include a set number of hours. 
                      Consider tiered options (10hrs, 20hrs, 40hrs/month) at different price points.
                    </p>
                  </div>
                )}
                {newProduct.category === 'Software' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-800">
                      <strong>Software pricing tips:</strong> Per-seat pricing is common. 
                      Consider annual discounts (typically 10-20%) and enterprise tiers for 50+ seats.
                    </p>
                  </div>
                )}
                {newProduct.category === 'Certifications' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs text-orange-800">
                      <strong>Certification pricing tips:</strong> Include initial certification fee and annual renewal. 
                      Re-examination fees are typically 50-75% of the initial fee.
                    </p>
                  </div>
                )}
                {newProduct.category === 'Embedded Teams' && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <p className="text-xs text-indigo-800">
                      <strong>Embedded Teams pricing tips:</strong> Monthly rates should reflect role seniority. 
                      Consider quarterly/annual discounts for longer commitments (10-15% discount).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsNewProductDialogOpen(false);
                // Reset form
                setNewProduct({
                  category: 'Workshops',
                  status: 'Active',
                  pricing: {
                    model: 'Per Event',
                    amount: 0,
                    currency: 'USD',
                  },
                });
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveNewProduct}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}