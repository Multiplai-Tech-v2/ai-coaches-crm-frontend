import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/app/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Contacts } from '@/pages/Contacts';
import { Companies } from '@/pages/Companies';
import { Accounts } from '@/app/components/Accounts';
import { AccountDetail } from '@/app/components/AccountDetail';
import { Pipeline } from '@/app/components/Pipeline';
import { Proposals } from '@/app/components/Proposals';
import { ProductCatalog } from '@/app/components/ProductCatalog';
import { ListManagement } from '@/app/components/ListManagement';
import { EmailSequences } from '@/app/pages/EmailSequences';
import { DealRooms } from '@/app/components/DealRooms';

export type ViewType = 'dashboard' | 'accounts' | 'contacts' | 'companies' | 'pipeline' | 'proposals' | 'products' | 'lists' | 'sequences' | 'dealrooms';

export const MainApp = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Map current route to ViewType for sidebar
  const getCurrentView = (): ViewType => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    if (path.startsWith('/accounts')) return 'accounts';
    if (path.startsWith('/contacts')) return 'contacts';
    if (path.startsWith('/companies')) return 'companies';
    if (path.startsWith('/pipeline')) return 'pipeline';
    if (path.startsWith('/proposals')) return 'proposals';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/lists')) return 'lists';
    if (path.startsWith('/sequences')) return 'sequences';
    if (path.startsWith('/dealrooms')) return 'dealrooms';
    return 'dashboard';
  };

  const handleViewChange = (view: ViewType) => {
    setSelectedAccountId(null);
    const viewRoutes: Record<ViewType, string> = {
      dashboard: '/dashboard',
      accounts: '/accounts',
      contacts: '/contacts',
      companies: '/companies',
      pipeline: '/pipeline',
      proposals: '/proposals',
      products: '/products',
      lists: '/lists',
      sequences: '/sequences',
      dealrooms: '/dealrooms',
    };
    navigate(viewRoutes[view]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={getCurrentView()} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lists" element={<ListManagement />} />
          <Route path="/accounts" element={<Accounts onSelectAccount={setSelectedAccountId} />} />
          <Route path="/accounts/:id" element={<AccountDetail accountId={selectedAccountId} onBack={() => setSelectedAccountId(null)} />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/sequences" element={<EmailSequences />} />
          <Route path="/dealrooms" element={<DealRooms />} />
        </Routes>
      </main>
    </div>
  );
};
