export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
  phone?: string;
  account_id?: string;
  account_name?: string;
  department?: string;
  stakeholder_role?: 'Champion' | 'Decision Maker' | 'Influencer' | 'Blocker' | 'End User' | 'Technical Evaluator' | 'Economic Buyer';
  relationship_score?: number;
  reports_to?: string;
  linkedin_url?: string;
  last_contact?: string;
  assigned_to?: string;
  allocation_date?: string;
  disc_profile?: 'D' | 'I' | 'S' | 'C' | 'Di' | 'Id' | 'Si' | 'Sc' | 'Cd' | 'Ci' | 'Dc' | 'Ds' | 'Is' | 'Ic';
  created_at?: string;
  updated_at?: string;
}

export interface ContactsResponse {
  data: Contact[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
