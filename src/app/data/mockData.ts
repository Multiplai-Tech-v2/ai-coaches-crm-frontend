export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  accountId: string;
  accountName: string;
  department?: string;
  stakeholderRole?: 'Champion' | 'Decision Maker' | 'Influencer' | 'Blocker' | 'End User' | 'Technical Evaluator' | 'Economic Buyer';
  relationshipScore?: number;
  reportsTo?: string;
  linkedInUrl?: string;
  lastContact?: string;
  assignedTo?: string;
  allocationDate?: string;
  discProfile?: 'D' | 'I' | 'S' | 'C' | 'Di' | 'Id' | 'Si' | 'Sc' | 'Cd' | 'Ci' | 'Dc' | 'Ds' | 'Is' | 'Ic';
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  employeeCount: string;
  revenue: string;
  status: 'Target' | 'Lead' | 'Prospect' | 'Opportunity' | 'Customer';
  lastActivity: string;
  owner: string;
  dealCount: number;
  contactCount: number;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  region?: string;
  assignedTo?: string;
  allocationDate?: string;
  investor?: string;
  investorType?: 'PE Firm' | 'VC Firm' | 'Family Office' | 'Public' | 'Unknown';
}

export interface Deal {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  value: number;
  stage: 'Suspect' | 'Lead' | 'Prospect' | 'Opportunity' | 'Customer';
  probability: number;
  closeDate: string;
  owner: string;
  registeredDate: string;
  isRegistered: boolean;
  status: 'Open' | 'Won' | 'Lost' | 'On Hold';
  primaryContact?: string;
  stakeholderCount: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: 'Workshops' | 'AI Consulting' | 'Software' | 'Certifications' | 'Embedded Teams';
  description: string;
  pricing: {
    model: string;
    amount: number;
    currency: string;
    billingFrequency?: string;
  };
  status: 'Active' | 'Coming Soon' | 'Archived';
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  accountId: string;
  accountName: string;
  dealId?: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent' | 'Viewed' | 'Accepted' | 'Declined' | 'Expired';
  totalValue: number;
  discount: number;
  createdDate: string;
  sentDate?: string;
  viewedDate?: string;
  acceptedDate?: string;
  validUntil: string;
  items: ProposalItem[];
}

export interface ProposalItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  title: string;
  description?: string;
  contactId?: string;
  contactName?: string;
  accountId?: string;
  accountName?: string;
  date: string;
  owner: string;
}

export interface EmailSequence {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  createdDate: string;
  startDate?: string;
  createdBy: string;
  contacts: EmailSequenceContact[];
}

export interface EmailSequenceContact {
  contactId: string;
  contactName: string;
  emails: SequenceEmail[];
}

export interface SequenceEmail {
  id: string;
  sequenceNumber: number;
  subject: string;
  body: string;
  scheduledDate?: string;
  sentDate?: string;
  openedDate?: string;
  respondedDate?: string;
  status: 'Scheduled' | 'Sent' | 'Opened' | 'Responded' | 'Bounced';
  aiRewriteSuggested?: boolean;
  rewriteReason?: string;
}

// Deal Room Interfaces
export interface DealRoom {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  dealId?: string;
  dealName?: string;
  status: 'Draft' | 'Active' | 'Archived';
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
  sharedWith: string[]; // Contact IDs
  accessLink: string;
  expiresDate?: string;
  theme: 'default' | 'professional' | 'modern';
  sections: DealRoomSection[];
  analytics: DealRoomAnalytics;
}

export interface DealRoomSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  items: DealRoomItem[];
}

export interface DealRoomItem {
  id: string;
  type: 'document' | 'video' | 'link' | 'testimonial' | 'case-study' | 'pricing';
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  content?: string;
  uploadedDate?: string;
  views: number;
  downloads: number;
}

export interface DealRoomAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  lastViewed?: string;
  averageTimeSpent: number; // in seconds
  viewsByContact: ViewerActivity[];
  contentEngagement: ContentEngagement[];
}

export interface ViewerActivity {
  contactId: string;
  contactName: string;
  contactEmail: string;
  firstViewed: string;
  lastViewed: string;
  totalViews: number;
  timeSpent: number; // in seconds
  itemsViewed: string[]; // Item IDs
  downloads: string[]; // Item IDs
}

export interface ContentEngagement {
  itemId: string;
  itemTitle: string;
  itemType: string;
  views: number;
  downloads: number;
  averageTimeSpent: number;
  viewRate: number; // percentage of visitors who viewed this
}

// Commission calculation helper
export function calculateCommission(dealValue: number) {
  return {
    salesperson: dealValue * 0.85,
    operations: dealValue * 0.10,
    advertising: dealValue * 0.05,
    total: dealValue
  };
}

// Mock email sequences
export const mockEmailSequences: EmailSequence[] = [
  {
    id: 'seq-1',
    name: 'TechVenture Executive Outreach',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    status: 'Active',
    createdDate: '2026-01-15',
    startDate: '2026-01-16',
    createdBy: 'Sarah Johnson',
    contacts: [
      {
        contactId: 'con-1',
        contactName: 'Jennifer Martinez',
        emails: [
          {
            id: 'email-1-1',
            sequenceNumber: 1,
            subject: 'AI Strategy Discussion for {{companyName}}',
            body: 'Hi {{firstName}},\n\nI hope this email finds you well. I wanted to reach out regarding how AI implementation could transform {{companyName}}\'s operations.\n\nMany companies in the {{companyIndustry}} sector with {{companySize}} are seeing remarkable results from strategic AI adoption.\n\nWould you be open to a brief call next week?\n\nBest regards,\n{{myFirstName}} {{myLastName}}\n{{myTitle}}',
            scheduledDate: '2026-01-16',
            sentDate: '2026-01-16',
            openedDate: '2026-01-16',
            respondedDate: '2026-01-17',
            status: 'Responded',
          },
          {
            id: 'email-1-2',
            sequenceNumber: 2,
            subject: 'Following up: AI Workshop Proposal for {{companyName}}',
            body: 'Hi {{firstName}},\n\nThank you for our conversation yesterday. As discussed, I\'m attaching our AI Fundamentals Workshop proposal tailored specifically for {{companyName}}.\n\nThis would be perfect for your leadership team in {{companyLocation}}.\n\nLooking forward to moving forward together!\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-20',
            sentDate: '2026-01-20',
            openedDate: '2026-01-20',
            status: 'Opened',
          },
          {
            id: 'email-1-3',
            sequenceNumber: 3,
            subject: 'Next Steps: AI Implementation Roadmap',
            body: 'Hi {{firstName}},\n\nI wanted to check in on the workshop proposal and discuss potential next steps for {{companyName}}\'s AI journey.\n\nOur team has worked with several {{companyIndustry}} companies and would love to share some relevant case studies.\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-25',
            status: 'Scheduled',
          },
        ],
      },
      {
        contactId: 'con-2',
        contactName: 'Robert Kim',
        emails: [
          {
            id: 'email-2-1',
            sequenceNumber: 1,
            subject: 'Technical Deep Dive: AI Infrastructure at {{companyName}}',
            body: 'Hi {{firstName}},\n\nI understand you\'re leading {{companyName}}\'s technology initiatives as {{title}}. I\'d love to discuss how our AI solutions could integrate with your current infrastructure.\n\nGiven your background in {{department}}, I think you\'ll find our technical approach particularly interesting.\n\nBest regards,\n{{myFirstName}} {{myLastName}}',
            scheduledDate: '2026-01-17',
            sentDate: '2026-01-17',
            openedDate: '2026-01-17',
            status: 'Opened',
          },
          {
            id: 'email-2-2',
            sequenceNumber: 2,
            subject: 'Re: Technical Deep Dive - {{firstName}} at {{companyName}} mentioned our conversation',
            body: 'Hi {{firstName}},\n\nI wanted to follow up on my previous email. Jennifer Martinez, your CEO, has already expressed strong interest in {{companyName}}\'s AI transformation initiative!\n\nShe mentioned you\'d be the perfect person to evaluate the technical aspects. Would you have time for a brief call to discuss the technical implementation?\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-21',
            status: 'Scheduled',
            aiRewriteSuggested: true,
            rewriteReason: 'Jennifer Martinez responded to Email 1 - reference the conversation',
          },
          {
            id: 'email-2-3',
            sequenceNumber: 3,
            subject: 'AI Architecture Assessment for {{companyName}}',
            body: 'Hi {{firstName}},\n\nFollowing our discussion, I\'d like to propose a technical assessment of your current architecture at {{companyName}}.\n\nThis complimentary assessment has helped many {{companyIndustry}} companies identify key optimization opportunities.\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-26',
            status: 'Scheduled',
          },
        ],
      },
      {
        contactId: 'con-3',
        contactName: 'Amanda Thompson',
        emails: [
          {
            id: 'email-3-1',
            sequenceNumber: 1,
            subject: 'Operational Efficiency through AI at {{companyName}}',
            body: 'Hi {{firstName}},\n\nAs {{title}} at {{companyName}}, you\'re in a unique position to see how AI could streamline your processes.\n\nI\'d love to share some case studies from {{companyIndustry}} companies that have achieved 30-40% efficiency gains.\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-18',
            sentDate: '2026-01-18',
            status: 'Sent',
          },
          {
            id: 'email-3-2',
            sequenceNumber: 2,
            subject: 'Re: Operational Efficiency - Jennifer at {{companyName}} is interested!',
            body: 'Hi {{firstName}},\n\nI wanted to follow up on operational AI opportunities at {{companyName}}. Great news - I\'ve been in active discussions with Jennifer Martinez about an AI workshop for the leadership team!\n\nWould you like to be involved in the planning? I think your operational perspective would be invaluable.\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-22',
            status: 'Scheduled',
            aiRewriteSuggested: true,
            rewriteReason: 'Jennifer Martinez responded to Email 1 - reference the active conversation',
          },
          {
            id: 'email-3-3',
            sequenceNumber: 3,
            subject: 'Process Automation Workshop for {{department}}',
            body: 'Hi {{firstName}},\n\nI\'d like to propose a dedicated session on process automation for your operations team at {{companyName}}.\n\nThis workshop can be customized for your {{companyLocation}} office.\n\nBest regards,\n{{myFirstName}}',
            scheduledDate: '2026-01-27',
            status: 'Scheduled',
          },
        ],
      },
    ],
  },
  {
    id: 'seq-2',
    name: 'Global Finance Introduction',
    accountId: 'acc-2',
    accountName: 'Global Finance Ltd',
    status: 'Draft',
    createdDate: '2026-01-21',
    createdBy: 'Michael Chen',
    contacts: [
      {
        contactId: 'con-5',
        contactName: 'Sarah Williams',
        emails: [
          {
            id: 'email-5-1',
            sequenceNumber: 1,
            subject: 'AI in Financial Services',
            body: 'Hi Sarah,\n\nI\'d like to discuss how AI is transforming financial operations...',
            status: 'Scheduled',
          },
          {
            id: 'email-5-2',
            sequenceNumber: 2,
            subject: 'Follow-up: Compliance & AI',
            body: 'Hi Sarah,\n\nFollowing up on AI compliance solutions...',
            status: 'Scheduled',
          },
        ],
      },
      {
        contactId: 'con-6',
        contactName: 'Michael Brown',
        emails: [
          {
            id: 'email-6-1',
            sequenceNumber: 1,
            subject: 'Technical AI Solutions for Finance',
            body: 'Hi Michael,\n\nI understand you lead the technology team...',
            status: 'Scheduled',
          },
        ],
      },
    ],
  },
];

// Salespeople data
export interface Salesperson {
  id: string;
  name: string;
  email: string;
  territories: string[];
  accountsAssigned: number;
  contactsAssigned: number;
  avatar?: string;
  initials?: string;
  color?: string;
}

export const mockSalespeople: Salesperson[] = [
  {
    id: 'sp-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@aicoaches.com',
    territories: ['California', 'Massachusetts'],
    accountsAssigned: 3,
    contactsAssigned: 24,
    initials: 'SJ',
    color: '#3b82f6'
  },
  {
    id: 'sp-2',
    name: 'Michael Chen',
    email: 'michael.chen@aicoaches.com',
    territories: ['New York'],
    accountsAssigned: 1,
    contactsAssigned: 5,
    initials: 'MC',
    color: '#8b5cf6'
  },
  {
    id: 'sp-3',
    name: 'David Park',
    email: 'david.park@aicoaches.com',
    territories: ['Illinois'],
    accountsAssigned: 1,
    contactsAssigned: 15,
    initials: 'DP',
    color: '#ec4899'
  },
  {
    id: 'sp-4',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@aicoaches.com',
    territories: [],
    accountsAssigned: 0,
    contactsAssigned: 0,
    initials: 'ER',
    color: '#f59e0b'
  },
  {
    id: 'sp-5',
    name: 'James Wilson',
    email: 'james.wilson@aicoaches.com',
    territories: [],
    accountsAssigned: 0,
    contactsAssigned: 0,
    initials: 'JW',
    color: '#10b981'
  },
];

// Mock data
export const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'TechVenture Corp',
    industry: 'Technology',
    employeeCount: '500-1000',
    revenue: '$50M-$100M',
    status: 'Prospect',
    lastActivity: '2026-01-20',
    owner: 'Sarah Johnson',
    dealCount: 2,
    contactCount: 8,
    website: 'techventure.com',
    address: '123 Market St, San Francisco, CA 94103',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    region: 'North America',
    assignedTo: 'Sarah Johnson',
    investor: 'Sequoia Capital',
    investorType: 'VC Firm'
  },
  {
    id: 'acc-2',
    name: 'Global Finance Ltd',
    industry: 'Financial Services',
    employeeCount: '1000-5000',
    revenue: '$100M-$500M',
    status: 'Lead',
    lastActivity: '2026-01-21',
    owner: 'Michael Chen',
    dealCount: 1,
    contactCount: 5,
    website: 'globalfinance.com',
    address: '45 Wall Street, New York, NY 10005',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    region: 'North America',
    assignedTo: 'Michael Chen',
    investor: 'BlackRock',
    investorType: 'Public'
  },
  {
    id: 'acc-3',
    name: 'Healthcare Innovations Inc',
    industry: 'Healthcare',
    employeeCount: '200-500',
    revenue: '$25M-$50M',
    status: 'Opportunity',
    lastActivity: '2026-01-22',
    owner: 'Sarah Johnson',
    dealCount: 3,
    contactCount: 12,
    website: 'healthcareinnovations.com',
    address: '200 Berkeley St, Boston, MA 02116',
    city: 'Boston',
    state: 'Massachusetts',
    country: 'United States',
    region: 'North America',
    assignedTo: 'Sarah Johnson',
    investor: 'KKR',
    investorType: 'PE Firm'
  },
  {
    id: 'acc-4',
    name: 'RetailMax Group',
    industry: 'Retail',
    employeeCount: '5000+',
    revenue: '$500M+',
    status: 'Customer',
    lastActivity: '2026-01-19',
    owner: 'David Park',
    dealCount: 5,
    contactCount: 15,
    website: 'retailmax.com',
    address: '875 N Michigan Ave, Chicago, IL 60611',
    city: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    region: 'North America',
    assignedTo: 'David Park',
    investorType: 'Public'
  },
  {
    id: 'acc-5',
    name: 'Manufacturing Pro',
    industry: 'Manufacturing',
    employeeCount: '100-200',
    revenue: '$10M-$25M',
    status: 'Target',
    lastActivity: '2026-01-18',
    owner: 'Unassigned',
    dealCount: 0,
    contactCount: 3,
    website: 'mfgpro.com',
    address: '1234 Woodward Ave, Detroit, MI 48226',
    city: 'Detroit',
    state: 'Michigan',
    country: 'United States',
    region: 'North America',
    investor: 'Johnson Family Office',
    investorType: 'Family Office'
  },
  {
    id: 'acc-6',
    name: 'Pacific Tech Solutions',
    industry: 'Technology',
    employeeCount: '200-500',
    revenue: '$25M-$50M',
    status: 'Target',
    lastActivity: '2026-01-17',
    owner: 'Unassigned',
    dealCount: 0,
    contactCount: 5,
    website: 'pacifictech.com',
    address: '1500 4th Ave, Seattle, WA 98101',
    city: 'Seattle',
    state: 'Washington',
    country: 'United States',
    region: 'North America',
    investor: 'Andreessen Horowitz',
    investorType: 'VC Firm'
  },
  {
    id: 'acc-7',
    name: 'Austin Energy Corp',
    industry: 'Energy',
    employeeCount: '500-1000',
    revenue: '$50M-$100M',
    status: 'Target',
    lastActivity: '2026-01-16',
    owner: 'Unassigned',
    dealCount: 0,
    contactCount: 7,
    website: 'austinenergy.com',
    address: '500 Congress Ave, Austin, TX 78701',
    city: 'Austin',
    state: 'Texas',
    country: 'United States',
    region: 'North America',
    investorType: 'Unknown'
  },
  {
    id: 'acc-8',
    name: 'London Financial Group',
    industry: 'Financial Services',
    employeeCount: '1000-5000',
    revenue: '$100M-$500M',
    status: 'Target',
    lastActivity: '2026-01-15',
    owner: 'Unassigned',
    dealCount: 0,
    contactCount: 10,
    website: 'londonfinancial.co.uk',
    address: '1 Canada Square, London E14 5AB',
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    region: 'Europe',
    investor: 'Carlyle Group',
    investorType: 'PE Firm'
  },
  {
    id: 'acc-9',
    name: 'Sydney Tech Ventures',
    industry: 'Technology',
    employeeCount: '100-200',
    revenue: '$10M-$25M',
    status: 'Target',
    lastActivity: '2026-01-14',
    owner: 'Unassigned',
    dealCount: 0,
    contactCount: 4,
    website: 'sydneytech.com.au',
    address: '100 Market St, Sydney NSW 2000',
    city: 'Sydney',
    state: 'New South Wales',
    country: 'Australia',
    region: 'Asia Pacific',
    investor: 'Blackbird Ventures',
    investorType: 'VC Firm'
  },
  {
    id: 'acc-10',
    name: 'Toronto Healthcare',
    industry: 'Healthcare',
    employeeCount: '200-500',
    revenue: '$25M-$50M',
    status: 'Target',
    lastActivity: '2026-01-13',
    owner: 'Unassigned',
    dealCount: 0,
    contactCount: 6,
    website: 'torontohealthcare.ca',
    address: '123 King St W, Toronto, ON M5H 1A1',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    region: 'North America',
    investorType: 'Unknown'
  },
];

export const mockContacts: Contact[] = [
  {
    id: 'con-1',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    title: 'CEO',
    email: 'j.martinez@techventure.com',
    phone: '+1 (555) 123-4567',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    department: 'Executive',
    stakeholderRole: 'Economic Buyer',
    relationshipScore: 8,
    lastContact: '2026-01-20',
    linkedInUrl: 'https://linkedin.com/in/jennifer-martinez',
    discProfile: 'Di'
  },
  {
    id: 'con-2',
    firstName: 'Robert',
    lastName: 'Kim',
    title: 'CTO',
    email: 'r.kim@techventure.com',
    phone: '+1 (555) 123-4568',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    department: 'Technology',
    stakeholderRole: 'Champion',
    relationshipScore: 9,
    reportsTo: 'con-1',
    lastContact: '2026-01-21',
    linkedInUrl: 'https://linkedin.com/in/robert-kim-cto',
    discProfile: 'Ci'
  },
  {
    id: 'con-3',
    firstName: 'Amanda',
    lastName: 'Thompson',
    title: 'VP of Operations',
    email: 'a.thompson@techventure.com',
    phone: '+1 (555) 123-4569',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    department: 'Operations',
    stakeholderRole: 'Influencer',
    relationshipScore: 6,
    reportsTo: 'con-1',
    lastContact: '2026-01-19',
    linkedInUrl: 'https://linkedin.com/in/amanda-thompson',
    discProfile: 'Sc'
  },
  {
    id: 'con-4',
    firstName: 'David',
    lastName: 'Lee',
    title: 'Director of IT',
    email: 'd.lee@techventure.com',
    phone: '+1 (555) 123-4570',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    department: 'Technology',
    stakeholderRole: 'Technical Evaluator',
    relationshipScore: 7,
    reportsTo: 'con-2',
    lastContact: '2026-01-18',
    linkedInUrl: 'https://linkedin.com/in/david-lee-it',
    discProfile: 'C'
  },
  {
    id: 'con-5',
    firstName: 'Sarah',
    lastName: 'Williams',
    title: 'CFO',
    email: 's.williams@globalfinance.com',
    phone: '+1 (555) 234-5678',
    accountId: 'acc-2',
    accountName: 'Global Finance Ltd',
    department: 'Finance',
    stakeholderRole: 'Economic Buyer',
    relationshipScore: 5,
    lastContact: '2026-01-21',
    linkedInUrl: 'https://linkedin.com/in/sarah-williams-cfo',
    discProfile: 'Dc'
  },
  {
    id: 'con-6',
    firstName: 'Michael',
    lastName: 'Brown',
    title: 'VP of Technology',
    email: 'm.brown@globalfinance.com',
    phone: '+1 (555) 234-5679',
    accountId: 'acc-2',
    accountName: 'Global Finance Ltd',
    department: 'Technology',
    stakeholderRole: 'Blocker',
    relationshipScore: 3,
    reportsTo: 'con-5',
    lastContact: '2026-01-20',
    linkedInUrl: 'https://linkedin.com/in/michael-brown-tech',
    discProfile: 'D'
  },
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    name: 'TechVenture AI Transformation',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    value: 250000,
    stage: 'Opportunity',
    probability: 75,
    closeDate: '2026-03-15',
    owner: 'Sarah Johnson',
    registeredDate: '2026-01-10',
    isRegistered: true,
    status: 'Open',
    primaryContact: 'Robert Kim',
    stakeholderCount: 4
  },
  {
    id: 'deal-2',
    name: 'Global Finance Software Suite',
    accountId: 'acc-2',
    accountName: 'Global Finance Ltd',
    value: 180000,
    stage: 'Prospect',
    probability: 40,
    closeDate: '2026-04-30',
    owner: 'Michael Chen',
    registeredDate: '2026-01-15',
    isRegistered: true,
    status: 'Open',
    primaryContact: 'Sarah Williams',
    stakeholderCount: 2
  },
  {
    id: 'deal-3',
    name: 'Healthcare Innovations Training Program',
    accountId: 'acc-3',
    accountName: 'Healthcare Innovations Inc',
    value: 95000,
    stage: 'Opportunity',
    probability: 60,
    closeDate: '2026-02-28',
    owner: 'Sarah Johnson',
    registeredDate: '2025-12-20',
    isRegistered: true,
    status: 'Open',
    primaryContact: 'Dr. Emily Chen',
    stakeholderCount: 5
  },
  {
    id: 'deal-4',
    name: 'RetailMax Embedded Team',
    accountId: 'acc-4',
    accountName: 'RetailMax Group',
    value: 450000,
    stage: 'Customer',
    probability: 100,
    closeDate: '2026-01-05',
    owner: 'David Park',
    registeredDate: '2025-11-01',
    isRegistered: true,
    status: 'Won',
    primaryContact: 'James Rodriguez',
    stakeholderCount: 6
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'AI Strategy Workshop',
    code: 'WS-AI-001',
    category: 'Workshops',
    description: 'Full-day intensive workshop on AI strategy and implementation roadmap',
    pricing: {
      model: 'Per Participant',
      amount: 1500,
      currency: 'USD',
      billingFrequency: 'One-time'
    },
    status: 'Active'
  },
  {
    id: 'prod-2',
    name: 'Fractional Chief AI Officer',
    code: 'CAIO-20HR',
    category: 'AI Consulting',
    description: '20 hours per month of executive AI leadership and guidance',
    pricing: {
      model: 'Monthly Retainer',
      amount: 15000,
      currency: 'USD',
      billingFrequency: 'Monthly'
    },
    status: 'Active'
  },
  {
    id: 'prod-3',
    name: 'Enterprise CRM Platform',
    code: 'SW-CRM-ENT',
    category: 'Software',
    description: 'Full-featured relationship intelligence CRM with org chart mapping',
    pricing: {
      model: 'Per Seat',
      amount: 99,
      currency: 'USD',
      billingFrequency: 'Monthly'
    },
    status: 'Active'
  },
  {
    id: 'prod-4',
    name: 'AI Coach Certification',
    code: 'CERT-AIC-001',
    category: 'Certifications',
    description: 'Professional certification program for AI coaching and implementation',
    pricing: {
      model: 'Per Candidate',
      amount: 2500,
      currency: 'USD',
      billingFrequency: 'One-time'
    },
    status: 'Active'
  },
  {
    id: 'prod-5',
    name: 'Senior AI Engineer (Embedded)',
    code: 'EMB-AI-SR',
    category: 'Embedded Teams',
    description: 'Full-time senior AI engineer embedded in your organization',
    pricing: {
      model: 'Monthly Rate',
      amount: 18000,
      currency: 'USD',
      billingFrequency: 'Monthly'
    },
    status: 'Active'
  },
  {
    id: 'prod-6',
    name: 'Data Analytics Workshop',
    code: 'WS-DATA-001',
    category: 'Workshops',
    description: 'Online 4-session workshop on data-driven decision making',
    pricing: {
      model: 'Per Participant',
      amount: 1200,
      currency: 'USD',
      billingFrequency: 'One-time'
    },
    status: 'Active'
  },
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop-1',
    proposalNumber: 'PROP-2026-00001',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    dealId: 'deal-1',
    status: 'Sent',
    totalValue: 250000,
    discount: 10,
    createdDate: '2026-01-15',
    sentDate: '2026-01-16',
    viewedDate: '2026-01-17',
    validUntil: '2026-02-15',
    items: [
      {
        productId: 'prod-2',
        productName: 'Fractional Chief AI Officer',
        quantity: 12,
        unitPrice: 15000,
        discount: 0,
        total: 180000
      },
      {
        productId: 'prod-1',
        productName: 'AI Strategy Workshop',
        quantity: 30,
        unitPrice: 1500,
        discount: 10,
        total: 40500
      },
      {
        productId: 'prod-4',
        productName: 'AI Coach Certification',
        quantity: 10,
        unitPrice: 2500,
        discount: 20,
        total: 20000
      }
    ]
  },
  {
    id: 'prop-2',
    proposalNumber: 'PROP-2026-00002',
    accountId: 'acc-2',
    accountName: 'Global Finance Ltd',
    dealId: 'deal-2',
    status: 'Draft',
    totalValue: 180000,
    discount: 5,
    createdDate: '2026-01-20',
    validUntil: '2026-02-20',
    items: [
      {
        productId: 'prod-3',
        productName: 'Enterprise CRM Platform',
        quantity: 50,
        unitPrice: 99,
        discount: 5,
        total: 4702.5
      }
    ]
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'meeting',
    title: 'Discovery Call with Robert Kim',
    description: 'Discussed AI implementation roadmap and current challenges',
    contactId: 'con-2',
    contactName: 'Robert Kim',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    date: '2026-01-21',
    owner: 'Sarah Johnson'
  },
  {
    id: 'act-2',
    type: 'email',
    title: 'Proposal Follow-up',
    description: 'Sent follow-up email regarding proposal timeline',
    contactId: 'con-1',
    contactName: 'Jennifer Martinez',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    date: '2026-01-20',
    owner: 'Sarah Johnson'
  },
  {
    id: 'act-3',
    type: 'call',
    title: 'Budget Discussion',
    description: 'Confirmed Q1 budget availability',
    contactId: 'con-5',
    contactName: 'Sarah Williams',
    accountId: 'acc-2',
    accountName: 'Global Finance Ltd',
    date: '2026-01-21',
    owner: 'Michael Chen'
  },
  {
    id: 'act-4',
    type: 'meeting',
    title: 'Product Demo',
    description: 'Demonstrated CRM org chart features',
    contactId: 'con-2',
    contactName: 'Robert Kim',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    date: '2026-01-19',
    owner: 'Sarah Johnson'
  },
];

// Mock Deal Rooms
export const mockDealRooms: DealRoom[] = [
  {
    id: 'dr-1',
    name: 'TechVenture AI Transformation - Deal Room',
    accountId: 'acc-1',
    accountName: 'TechVenture Corp',
    dealId: 'deal-1',
    dealName: 'TechVenture AI Transformation',
    status: 'Active',
    createdDate: '2026-01-16',
    lastUpdated: '2026-01-21',
    createdBy: 'Sarah Johnson',
    sharedWith: ['con-1', 'con-2', 'con-3'],
    accessLink: 'https://dealroom.aicoaches.com/tv-ai-transformation',
    expiresDate: '2026-03-31',
    theme: 'professional',
    sections: [
      {
        id: 'sec-1',
        title: 'Getting Started',
        description: 'Essential information about our AI transformation services',
        order: 1,
        items: [
          {
            id: 'item-1',
            type: 'document',
            title: 'AI Transformation Overview',
            description: 'Comprehensive guide to AI implementation strategy',
            fileName: 'AI-Transformation-Overview.pdf',
            fileSize: '2.4 MB',
            uploadedDate: '2026-01-16',
            views: 24,
            downloads: 8
          },
          {
            id: 'item-2',
            type: 'video',
            title: 'Welcome Video from CEO',
            description: 'Personal introduction to our partnership approach',
            videoUrl: 'https://player.vimeo.com/video/example',
            uploadedDate: '2026-01-16',
            views: 18,
            downloads: 0
          },
        ]
      },
      {
        id: 'sec-2',
        title: 'Case Studies & Testimonials',
        description: 'Success stories from companies like yours',
        order: 2,
        items: [
          {
            id: 'item-3',
            type: 'case-study',
            title: 'RetailMax: 40% Efficiency Gain',
            description: 'How RetailMax transformed operations with AI',
            content: 'RetailMax Group implemented our AI solutions and achieved a 40% increase in operational efficiency within 6 months...',
            uploadedDate: '2026-01-17',
            views: 15,
            downloads: 5
          },
          {
            id: 'item-4',
            type: 'testimonial',
            title: 'CFO Testimonial - Global Finance Ltd',
            description: 'Sarah Williams on AI-driven decision making',
            content: '"The AI consulting services from AiCoaches transformed how we approach financial modeling and risk assessment." - Sarah Williams, CFO',
            uploadedDate: '2026-01-17',
            views: 12,
            downloads: 0
          },
          {
            id: 'item-5',
            type: 'document',
            title: 'Technology Sector Case Studies',
            description: '5 detailed case studies from tech companies',
            fileName: 'Tech-Sector-Case-Studies.pdf',
            fileSize: '4.1 MB',
            uploadedDate: '2026-01-18',
            views: 14,
            downloads: 6
          },
        ]
      },
      {
        id: 'sec-3',
        title: 'Proposal & Pricing',
        description: 'Detailed proposal and pricing information',
        order: 3,
        items: [
          {
            id: 'item-6',
            type: 'pricing',
            title: 'Custom Pricing Proposal',
            description: 'Tailored pricing for TechVenture Corp',
            content: 'Executive Summary: Total Investment $250,000 over 12 months...',
            uploadedDate: '2026-01-19',
            views: 22,
            downloads: 11
          },
          {
            id: 'item-7',
            type: 'document',
            title: 'Implementation Timeline',
            description: '90-day implementation roadmap',
            fileName: 'Implementation-Timeline.pdf',
            fileSize: '1.8 MB',
            uploadedDate: '2026-01-19',
            views: 19,
            downloads: 9
          },
        ]
      },
      {
        id: 'sec-4',
        title: 'Technical Documentation',
        description: 'Technical architecture and integration guides',
        order: 4,
        items: [
          {
            id: 'item-8',
            type: 'document',
            title: 'Technical Architecture Overview',
            description: 'System architecture and integration points',
            fileName: 'Technical-Architecture.pdf',
            fileSize: '3.2 MB',
            uploadedDate: '2026-01-20',
            views: 11,
            downloads: 4
          },
          {
            id: 'item-9',
            type: 'video',
            title: 'Platform Demo Recording',
            description: '30-minute walkthrough of the AI platform',
            videoUrl: 'https://player.vimeo.com/video/example-demo',
            uploadedDate: '2026-01-20',
            views: 16,
            downloads: 0
          },
        ]
      },
      {
        id: 'sec-5',
        title: 'Next Steps',
        description: 'How to move forward with the engagement',
        order: 5,
        items: [
          {
            id: 'item-10',
            type: 'document',
            title: 'Service Agreement (Draft)',
            description: 'Master Services Agreement for review',
            fileName: 'MSA-TechVenture-Draft.pdf',
            fileSize: '890 KB',
            uploadedDate: '2026-01-21',
            views: 9,
            downloads: 3
          },
          {
            id: 'item-11',
            type: 'link',
            title: 'Schedule Kickoff Meeting',
            description: 'Book your implementation kickoff call',
            linkUrl: 'https://calendly.com/aicoaches/kickoff',
            uploadedDate: '2026-01-21',
            views: 7,
            downloads: 0
          },
        ]
      },
    ],
    analytics: {
      totalViews: 167,
      uniqueVisitors: 3,
      lastViewed: '2026-01-21 14:30:00',
      averageTimeSpent: 892, // seconds
      viewsByContact: [
        {
          contactId: 'con-1',
          contactName: 'Jennifer Martinez',
          contactEmail: 'j.martinez@techventure.com',
          firstViewed: '2026-01-17 09:15:00',
          lastViewed: '2026-01-21 14:30:00',
          totalViews: 8,
          timeSpent: 2140,
          itemsViewed: ['item-1', 'item-2', 'item-6', 'item-7', 'item-10'],
          downloads: ['item-1', 'item-6', 'item-7']
        },
        {
          contactId: 'con-2',
          contactName: 'Robert Kim',
          contactEmail: 'r.kim@techventure.com',
          firstViewed: '2026-01-18 11:20:00',
          lastViewed: '2026-01-21 10:45:00',
          totalViews: 12,
          timeSpent: 1890,
          itemsViewed: ['item-1', 'item-2', 'item-3', 'item-5', 'item-8', 'item-9'],
          downloads: ['item-1', 'item-5', 'item-8']
        },
        {
          contactId: 'con-3',
          contactName: 'Amanda Thompson',
          contactEmail: 'a.thompson@techventure.com',
          firstViewed: '2026-01-19 15:00:00',
          lastViewed: '2026-01-20 16:20:00',
          totalViews: 5,
          timeSpent: 645,
          itemsViewed: ['item-1', 'item-3', 'item-6'],
          downloads: ['item-6']
        }
      ],
      contentEngagement: [
        {
          itemId: 'item-1',
          itemTitle: 'AI Transformation Overview',
          itemType: 'document',
          views: 24,
          downloads: 8,
          averageTimeSpent: 245,
          viewRate: 100
        },
        {
          itemId: 'item-2',
          itemTitle: 'Welcome Video from CEO',
          itemType: 'video',
          views: 18,
          downloads: 0,
          averageTimeSpent: 412,
          viewRate: 67
        },
        {
          itemId: 'item-6',
          itemTitle: 'Custom Pricing Proposal',
          itemType: 'pricing',
          views: 22,
          downloads: 11,
          averageTimeSpent: 380,
          viewRate: 100
        },
        {
          itemId: 'item-8',
          itemTitle: 'Technical Architecture Overview',
          itemType: 'document',
          views: 11,
          downloads: 4,
          averageTimeSpent: 198,
          viewRate: 33
        },
      ]
    }
  },
  {
    id: 'dr-2',
    name: 'Healthcare Innovations Training Program',
    accountId: 'acc-3',
    accountName: 'Healthcare Innovations Inc',
    dealId: 'deal-3',
    dealName: 'Healthcare Innovations Training Program',
    status: 'Active',
    createdDate: '2026-01-10',
    lastUpdated: '2026-01-18',
    createdBy: 'Sarah Johnson',
    sharedWith: ['con-7'],
    accessLink: 'https://dealroom.aicoaches.com/healthcare-training',
    expiresDate: '2026-02-28',
    theme: 'default',
    sections: [
      {
        id: 'sec-10',
        title: 'Program Overview',
        order: 1,
        items: [
          {
            id: 'item-20',
            type: 'document',
            title: 'Training Program Curriculum',
            fileName: 'Healthcare-Training-Curriculum.pdf',
            fileSize: '1.5 MB',
            uploadedDate: '2026-01-10',
            views: 12,
            downloads: 4
          },
        ]
      },
    ],
    analytics: {
      totalViews: 42,
      uniqueVisitors: 1,
      lastViewed: '2026-01-18 11:00:00',
      averageTimeSpent: 520,
      viewsByContact: [
        {
          contactId: 'con-7',
          contactName: 'Dr. Emily Chen',
          contactEmail: 'e.chen@healthcareinnovations.com',
          firstViewed: '2026-01-12 10:00:00',
          lastViewed: '2026-01-18 11:00:00',
          totalViews: 6,
          timeSpent: 520,
          itemsViewed: ['item-20'],
          downloads: ['item-20']
        }
      ],
      contentEngagement: []
    }
  }
];