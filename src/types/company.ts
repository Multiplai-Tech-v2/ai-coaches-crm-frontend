export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  employee_count?: number;
  annual_revenue?: number;
  status?: 'active' | 'inactive' | 'prospect' | 'customer';
  relationship_score?: number;
  assigned_to?: string;
  notes?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompaniesResponse {
  data: Company[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
