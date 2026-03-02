import { useState, useEffect } from 'react';
import { Users, Search, Plus, Mail, Phone, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Contact, ContactsResponse } from '@/types/contact';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import { ContactViewDialog } from '@/components/ContactViewDialog';
import { Skeleton } from '@/app/components/ui/skeleton';

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [meta, setMeta] = useState<ContactsResponse['meta']>(undefined);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { get, loading, error } = useAuthApi();

  useEffect(() => {
    fetchContacts(currentPage, perPage);
  }, [currentPage, perPage]);

  const fetchContacts = async (page = 1, itemsPerPage = 15) => {
    try {
      const response = await get<ContactsResponse>(
        `/v1/people?page=${page}&per_page=${itemsPerPage}`
      );
      if (response?.data) {
        setContacts(response.data);
        setMeta(response.meta);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    if (!meta) return [];
    const totalPages = meta.last_page;
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 4) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push('ellipsis');
    pages.push(totalPages);

    return pages;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.account_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || contact.stakeholder_role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStakeholderColor = (role?: string) => {
    switch (role) {
      case 'Economic Buyer':
        return 'bg-purple-100 text-purple-700';
      case 'Champion':
        return 'bg-green-100 text-green-700';
      case 'Decision Maker':
        return 'bg-blue-100 text-blue-700';
      case 'Blocker':
        return 'bg-red-100 text-red-700';
      case 'Influencer':
        return 'bg-yellow-100 text-yellow-700';
      case 'Technical Evaluator':
        return 'bg-indigo-100 text-indigo-700';
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

  if (loading && contacts.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && contacts.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load contacts</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchContacts(currentPage, perPage)}>Try Again</Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-500 mt-1">Manage your relationships and stakeholders</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Contact
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Economic Buyer">Economic Buyer</SelectItem>
              <SelectItem value="Champion">Champion</SelectItem>
              <SelectItem value="Decision Maker">Decision Maker</SelectItem>
              <SelectItem value="Blocker">Blocker</SelectItem>
              <SelectItem value="Influencer">Influencer</SelectItem>
              <SelectItem value="Technical Evaluator">Technical Evaluator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {loading && (
          Array.from({ length: perPage > 5 ? 5 : perPage }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-36" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            </Card>
          ))
        )}
        {!loading && filteredContacts.map((contact) => (
          <Card key={contact.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {contact.relationship_score && (
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getRelationshipColor(contact.relationship_score)}`} />
                        <span className="text-sm text-gray-600">{contact.relationship_score}/10</span>
                      </div>
                    )}
                  </div>
                  
                  {contact.title && (
                    <p className="text-sm text-gray-600 mb-3">{contact.title}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mb-3">
                    {contact.stakeholder_role && (
                      <Badge className={getStakeholderColor(contact.stakeholder_role)}>
                        {contact.stakeholder_role}
                      </Badge>
                    )}
                    {contact.department && (
                      <span className="text-sm text-gray-500">{contact.department}</span>
                    )}
                  </div>

                  {contact.account_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Building2 className="w-4 h-4" />
                      {contact.account_name}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6">
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    )}
                  </div>

                  {contact.last_contact && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last contact: {contact.last_contact}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {contact.email && (
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedContactId(contact.id);
                    setIsViewDialogOpen(true);
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Results info + per-page selector */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              {loading && (
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              )}
              <span>
                Showing {meta.from}–{meta.to} of {meta.total} contacts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                <SelectTrigger className="w-20 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, idx) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex h-8 w-8 items-center justify-center text-gray-400 text-sm"
                >
                  …
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className="h-8 w-8 p-0 text-sm"
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= (meta?.last_page ?? 1) || loading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Show results info even on single page */}
      {meta && meta.last_page === 1 && meta.total > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {loading && (
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            )}
            <span>
              Showing {meta.from}–{meta.to} of {meta.total} contacts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <Select value={String(perPage)} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <ContactFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => fetchContacts(currentPage, perPage)}
      />

      <ContactViewDialog
        contactId={selectedContactId}
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          setIsViewDialogOpen(open);
          if (!open) setSelectedContactId(null);
        }}
      />
    </div>
  );
}
