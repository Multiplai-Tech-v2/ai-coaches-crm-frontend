import { LayoutDashboard, Building2, Users, TrendingUp, FileText, Package, Settings, List, Mail, FolderOpen } from 'lucide-react';
import { ViewType } from '@/app/App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lists' as ViewType, label: 'List Management', icon: List },
    { id: 'accounts' as ViewType, label: 'Accounts', icon: Building2 },
    { id: 'contacts' as ViewType, label: 'Contacts', icon: Users },
    { id: 'pipeline' as ViewType, label: 'Pipeline', icon: TrendingUp },
    { id: 'sequences' as ViewType, label: 'Email Sequences', icon: Mail },
    { id: 'dealrooms' as ViewType, label: 'Deal Rooms', icon: FolderOpen },
    { id: 'proposals' as ViewType, label: 'Proposals', icon: FileText },
    { id: 'products' as ViewType, label: 'Product Catalog', icon: Package },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">AiCoaches CRM</h1>
        <p className="text-sm text-gray-500 mt-1">Relationship Intelligence</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
}