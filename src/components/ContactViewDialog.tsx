import { useEffect, useState } from 'react';
import {
  Mail, Phone, Smartphone, Printer, Linkedin, Building2, User,
  Calendar, BookOpen, GraduationCap, ExternalLink, Briefcase,
  Clock, Hash,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useAuthApi } from '@/hooks/useAuthApi';
import { ContactDetail, ContactCompany, ContactInvestor } from '@/types/contact';

interface ContactViewDialogProps {
  contactId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALL_FIELDS =
  'id,external_id,full_name,first_name,middle_name,last_name,prefix,gender,year_of_birth,' +
  'email,phone,mobile_phone,fax,linkedin_url,biography,university_institution,created_at,updated_at';

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-1.5 text-sm text-gray-800">
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        <span className="break-all">{String(value)}</span>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mt-6 mb-3">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{title}</span>
      <Separator className="flex-1" />
    </div>
  );
}

function getStakeholderColor(role?: string) {
  switch (role) {
    case 'Economic Buyer': return 'bg-purple-100 text-purple-700';
    case 'Champion': return 'bg-green-100 text-green-700';
    case 'Decision Maker': return 'bg-blue-100 text-blue-700';
    case 'Blocker': return 'bg-red-100 text-red-700';
    case 'Influencer': return 'bg-yellow-100 text-yellow-700';
    case 'Technical Evaluator': return 'bg-indigo-100 text-indigo-700';
    case 'End User': return 'bg-teal-100 text-teal-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getRelationshipColor(score?: number) {
  if (!score) return 'bg-gray-300';
  if (score >= 8) return 'bg-green-500';
  if (score >= 6) return 'bg-yellow-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
}

function getDiscColor(disc?: string) {
  switch (disc?.[0]) {
    case 'D': return 'bg-red-100 text-red-700';
    case 'I': return 'bg-yellow-100 text-yellow-700';
    case 'S': return 'bg-green-100 text-green-700';
    case 'C': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function CompanyRow({ company }: { company: ContactCompany }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center shrink-0">
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{company.name}</p>
          {company.position && (
            <p className="text-xs text-gray-500">{company.position}{company.position_level ? ` · ${company.position_level}` : ''}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-4">
        {company.is_primary && (
          <Badge className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0">Primary</Badge>
        )}
        {company.is_current ? (
          <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0">Current</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0">Former</Badge>
        )}
      </div>
    </div>
  );
}

function InvestorRow({ investor }: { investor: ContactInvestor }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center shrink-0">
          <Briefcase className="w-3.5 h-3.5 text-purple-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{investor.name}</p>
          {investor.position && (
            <p className="text-xs text-gray-500">{investor.position}{investor.position_level ? ` · ${investor.position_level}` : ''}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-4">
        {investor.is_primary_contact && (
          <Badge className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0">Primary</Badge>
        )}
        {investor.is_current ? (
          <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0">Current</Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0">Former</Badge>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactViewDialog({ contactId, open, onOpenChange }: ContactViewDialogProps) {
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const { get, loading } = useAuthApi();

  useEffect(() => {
    if (open && contactId) {
      setContact(null);
      get<{ data: ContactDetail }>(
        `/v1/people/${contactId}?fields=${ALL_FIELDS}&include=companies,investors`
      ).then((res) => {
        if (res?.data) setContact(res.data);
      }).catch(console.error);
    }
  }, [open, contactId]);

  const initials = contact
    ? `${contact.first_name?.[0] ?? ''}${contact.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>

        {loading && !contact ? (
          <LoadingSkeleton />
        ) : contact ? (
          <div className="pb-2">
            {/* ── Hero ── */}
            <div className="flex items-start gap-4 py-2">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {[contact.prefix, contact.full_name || `${contact.first_name} ${contact.last_name}`]
                    .filter(Boolean)
                    .join(' ')}
                </h2>
                {contact.title && (
                  <p className="text-sm text-gray-500 mt-0.5">{contact.title}{contact.department ? ` · ${contact.department}` : ''}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {contact.stakeholder_role && (
                    <Badge className={getStakeholderColor(contact.stakeholder_role)}>
                      {contact.stakeholder_role}
                    </Badge>
                  )}
                  {contact.disc_profile && (
                    <Badge className={getDiscColor(contact.disc_profile)}>
                      DISC: {contact.disc_profile}
                    </Badge>
                  )}
                  {contact.relationship_score != null && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${getRelationshipColor(contact.relationship_score)}`} />
                      <span className="text-xs text-gray-600">Relationship {contact.relationship_score}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Contact Info ── */}
            <SectionTitle title="Contact Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <DetailField label="Email" value={contact.email} icon={<Mail className="w-3.5 h-3.5" />} />
              <DetailField label="Phone" value={contact.phone} icon={<Phone className="w-3.5 h-3.5" />} />
              <DetailField label="Mobile Phone" value={contact.mobile_phone} icon={<Smartphone className="w-3.5 h-3.5" />} />
              <DetailField label="Fax" value={contact.fax} icon={<Printer className="w-3.5 h-3.5" />} />
              {contact.linkedin_url && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">LinkedIn</span>
                  <a
                    href={contact.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                  >
                    <Linkedin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{contact.linkedin_url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* ── Personal Info ── */}
            <SectionTitle title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <DetailField label="First Name" value={contact.first_name} icon={<User className="w-3.5 h-3.5" />} />
              <DetailField label="Last Name" value={contact.last_name} icon={<User className="w-3.5 h-3.5" />} />
              <DetailField label="Middle Name" value={contact.middle_name} />
              <DetailField label="Prefix / Salutation" value={contact.prefix} />
              <DetailField label="Gender" value={contact.gender} />
              <DetailField label="Year of Birth" value={contact.year_of_birth} icon={<Calendar className="w-3.5 h-3.5" />} />
              <DetailField label="University / Institution" value={contact.university_institution} icon={<GraduationCap className="w-3.5 h-3.5" />} />
            </div>

            {/* ── Professional Info ── */}
            {(contact.account_name || contact.department || contact.reports_to || contact.assigned_to || contact.allocation_date || contact.last_contact) && (
              <>
                <SectionTitle title="Professional" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <DetailField label="Company" value={contact.account_name} icon={<Building2 className="w-3.5 h-3.5" />} />
                  <DetailField label="Department" value={contact.department} />
                  <DetailField label="Reports To" value={contact.reports_to} icon={<User className="w-3.5 h-3.5" />} />
                  <DetailField label="Assigned To" value={contact.assigned_to} icon={<User className="w-3.5 h-3.5" />} />
                  <DetailField label="Allocation Date" value={formatDate(contact.allocation_date)} icon={<Calendar className="w-3.5 h-3.5" />} />
                  <DetailField label="Last Contact" value={formatDate(contact.last_contact)} icon={<Clock className="w-3.5 h-3.5" />} />
                </div>
              </>
            )}

            {/* ── Biography ── */}
            {contact.biography && (
              <>
                <SectionTitle title="Biography" />
                <div className="flex gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{contact.biography}</p>
                </div>
              </>
            )}

            {/* ── Companies ── */}
            {contact.companies && contact.companies.length > 0 && (
              <>
                <SectionTitle title={`Companies (${contact.companies.length})`} />
                <div className="rounded-lg border border-gray-100 px-3 divide-y divide-gray-100">
                  {contact.companies.map((company) => (
                    <CompanyRow key={company.id} company={company} />
                  ))}
                </div>
              </>
            )}

            {/* ── Investors ── */}
            {contact.investors && contact.investors.length > 0 && (
              <>
                <SectionTitle title={`Investors (${contact.investors.length})`} />
                <div className="rounded-lg border border-gray-100 px-3 divide-y divide-gray-100">
                  {contact.investors.map((investor) => (
                    <InvestorRow key={investor.id} investor={investor} />
                  ))}
                </div>
              </>
            )}

            {/* ── System Info ── */}
            <SectionTitle title="System" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <DetailField label="External ID" value={contact.external_id} icon={<Hash className="w-3.5 h-3.5" />} />
              <DetailField label="Internal ID" value={contact.id} icon={<Hash className="w-3.5 h-3.5" />} />
              <DetailField label="Created At" value={formatDate(contact.created_at)} icon={<Clock className="w-3.5 h-3.5" />} />
              <DetailField label="Updated At" value={formatDate(contact.updated_at)} icon={<Clock className="w-3.5 h-3.5" />} />
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            <User className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No contact data available.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
