import { useState, useEffect } from 'react';
import { Users, Search, Plus, Mail, Phone, User, Building2 } from 'lucide-react';
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

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { get, loading, error } = useAuthApi();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await get<ContactsResponse>('/v1/people');
      if (response?.data) {
        setContacts(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
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
            <Button onClick={fetchContacts}>Try Again</Button>
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
        {filteredContacts.map((contact) => (
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
                <Button variant="outline" size="sm">View</Button>
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

      <ContactFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchContacts}
      />
    </div>
  );
}
