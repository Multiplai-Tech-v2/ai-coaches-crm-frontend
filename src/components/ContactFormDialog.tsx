import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { useAuthApi } from '@/hooks/useAuthApi';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ContactFormDialog({ open, onOpenChange, onSuccess }: ContactFormDialogProps) {
  const { post, get, loading, error } = useAuthApi();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    title: '',
    department: '',
    account_id: '',
    stakeholder_role: '',
    relationship_score: '',
    linkedin_url: '',
  });

  useEffect(() => {
    if (open) {
      fetchCompanies();
    }
  }, [open]);

  const fetchCompanies = async () => {
    try {
      const response = await get<{ data: Company[] }>('/v1/companies');
      if (response?.data) {
        setCompanies(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare data, removing empty fields
      const submitData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      if (formData.email) submitData.email = formData.email;
      if (formData.phone) submitData.phone = formData.phone;
      if (formData.title) submitData.title = formData.title;
      if (formData.department) submitData.department = formData.department;
      if (formData.account_id) submitData.account_id = formData.account_id;
      if (formData.stakeholder_role) submitData.stakeholder_role = formData.stakeholder_role;
      if (formData.relationship_score) submitData.relationship_score = parseInt(formData.relationship_score);
      if (formData.linkedin_url) submitData.linkedin_url = formData.linkedin_url;

      await post('/v1/people', submitData);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        title: '',
        department: '',
        account_id: '',
        stakeholder_role: '',
        relationship_score: '',
        linkedin_url: '',
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to create contact:', err);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  required
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Title and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="VP of Sales"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Sales"
                />
              </div>
            </div>

            {/* Company Selection */}
            <div className="space-y-2">
              <Label htmlFor="account_id">Company</Label>
              <Select value={formData.account_id} onValueChange={(value) => handleChange('account_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stakeholder Role */}
            <div className="space-y-2">
              <Label htmlFor="stakeholder_role">Stakeholder Role</Label>
              <Select value={formData.stakeholder_role} onValueChange={(value) => handleChange('stakeholder_role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economic Buyer">Economic Buyer</SelectItem>
                  <SelectItem value="Champion">Champion</SelectItem>
                  <SelectItem value="Decision Maker">Decision Maker</SelectItem>
                  <SelectItem value="Blocker">Blocker</SelectItem>
                  <SelectItem value="Influencer">Influencer</SelectItem>
                  <SelectItem value="Technical Evaluator">Technical Evaluator</SelectItem>
                  <SelectItem value="End User">End User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Relationship Score */}
            <div className="space-y-2">
              <Label htmlFor="relationship_score">Relationship Score (1-10)</Label>
              <Input
                id="relationship_score"
                type="number"
                min="1"
                max="10"
                value={formData.relationship_score}
                onChange={(e) => handleChange('relationship_score', e.target.value)}
                placeholder="7"
              />
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
