import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { Dashboard } from '@/app/components/Dashboard';
import { Accounts } from '@/app/components/Accounts';
import { AccountDetail } from '@/app/components/AccountDetail';
import { Contacts } from '@/app/components/Contacts';
import { Pipeline } from '@/app/components/Pipeline';
import { Proposals } from '@/app/components/Proposals';
import { ProductCatalog } from '@/app/components/ProductCatalog';
import { ListManagement } from '@/app/components/ListManagement';
import { EmailSequences } from '@/app/pages/EmailSequences';
import { DealRooms } from '@/app/components/DealRooms';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { initErrorHandler } from '@/app/utils/errorHandler';

export type ViewType = 'dashboard' | 'accounts' | 'contacts' | 'pipeline' | 'proposals' | 'products' | 'lists' | 'sequences' | 'dealrooms';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Initialize error handler on mount
  useEffect(() => {
    initErrorHandler();
  }, []);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedAccountId(null);
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
  };

  const handleBackToAccounts = () => {
    setSelectedAccountId(null);
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        <main className="flex-1 overflow-auto">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'lists' && <ListManagement />}
          {currentView === 'accounts' && !selectedAccountId && <Accounts onSelectAccount={setSelectedAccountId} />}
          {currentView === 'accounts' && selectedAccountId && (
            <AccountDetail accountId={selectedAccountId} onBack={() => setSelectedAccountId(null)} />
          )}
          {currentView === 'contacts' && <Contacts />}
          {currentView === 'pipeline' && <Pipeline />}
          {currentView === 'proposals' && <Proposals />}
          {currentView === 'products' && <ProductCatalog />}
          {currentView === 'sequences' && <EmailSequences />}
          {currentView === 'dealrooms' && <DealRooms />}
        </main>
      </div>
    </ErrorBoundary>
  );
}