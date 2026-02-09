import { useState, useEffect } from 'react';
import { Building2, Search, Plus, Mail, Phone, MapPin, Globe, Users as UsersIcon, Linkedin, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Company, CompaniesResponse } from '@/types/company';
import { CompanyFormDialog } from '@/components/CompanyFormDialog';

export function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { get, loading, error } = useAuthApi();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await get<CompaniesResponse>('/v1/companies');
      if (response?.data) {
        setCompanies(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'customer':
        return 'bg-green-100 text-green-700';
      case 'prospect':
        return 'bg-blue-100 text-blue-700';
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRelationshipColor = (score?: number) => {
    if (!score) return 'bg-gray-300';
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatRevenue = (revenue?: number) => {
    if (!revenue) return null;
    if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    }
    if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(0)}K`;
    }
    return `$${revenue}`;
  };

  const formatEmployeeCount = (count?: number) => {
    if (!count) return null;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading && companies.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && companies.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load companies</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCompanies}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-500 mt-1">Manage your company relationships and accounts</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Company
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h3>
                    {company.relationship_score && (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getRelationshipColor(company.relationship_score)}`} />
                        <span className="text-sm text-gray-600">{company.relationship_score}/10</span>
                      </div>
                    )}
                  </div>
                  
                  {company.industry && (
                    <p className="text-sm text-gray-600 mb-3">{company.industry}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mb-3">
                    {company.status && (
                      <Badge className={getStatusColor(company.status)}>
                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                      </Badge>
                    )}
                    {company.employee_count && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <UsersIcon className="w-4 h-4" />
                        {formatEmployeeCount(company.employee_count)} employees
                      </div>
                    )}
                    {company.annual_revenue && (
                      <span className="text-sm text-gray-500">
                        {formatRevenue(company.annual_revenue)} revenue
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 flex-wrap">
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {company.email}
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {company.phone}
                      </div>
                    )}
                    {(company.city || company.state || company.country) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {[company.city, company.state, company.country].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Social Media Links */}
                  {(company.linkedin_url || company.twitter_url || company.facebook_url || company.instagram_url || company.youtube_url) && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">Social:</span>
                      <div className="flex items-center gap-2">
                        {company.linkedin_url && (
                          <a
                            href={company.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {company.twitter_url && (
                          <a
                            href={company.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            title="Twitter/X"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {company.facebook_url && (
                          <a
                            href={company.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-700 transition-colors"
                            title="Facebook"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                        )}
                        {company.instagram_url && (
                          <a
                            href={company.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-pink-600 transition-colors"
                            title="Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {company.youtube_url && (
                          <a
                            href={company.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="YouTube"
                          >
                            <Youtube className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {company.email && (
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      <CompanyFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchCompanies}
      />
    </div>
  );
}
