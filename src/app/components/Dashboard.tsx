import { TrendingUp, DollarSign, Users, FileText, ArrowUpRight, Mail, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockDeals, mockActivities, calculateCommission, mockAccounts } from '@/app/data/mockData';
import { ViewType } from '@/app/App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // Calculate pipeline metrics
  const openDeals = mockDeals.filter(d => d.status === 'Open');
  const totalPipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = mockDeals.filter(d => d.status === 'Won');
  const totalWonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  
  // Calculate commission for won deals
  const commission = calculateCommission(totalWonValue);
  
  // Pipeline by stage
  const stageData = [
    { stage: 'Suspect', count: mockDeals.filter(d => d.stage === 'Suspect').length, value: mockDeals.filter(d => d.stage === 'Suspect').reduce((s, d) => s + d.value, 0) },
    { stage: 'Lead', count: mockDeals.filter(d => d.stage === 'Lead').length, value: mockDeals.filter(d => d.stage === 'Lead').reduce((s, d) => s + d.value, 0) },
    { stage: 'Prospect', count: mockDeals.filter(d => d.stage === 'Prospect').length, value: mockDeals.filter(d => d.stage === 'Prospect').reduce((s, d) => s + d.value, 0) },
    { stage: 'Opportunity', count: mockDeals.filter(d => d.stage === 'Opportunity').length, value: mockDeals.filter(d => d.stage === 'Opportunity').reduce((s, d) => s + d.value, 0) },
  ];

  // Account status distribution
  const accountStatusData = [
    { name: 'Suspect', value: mockAccounts.filter(a => a.status === 'Suspect').length, color: '#94a3b8' },
    { name: 'Lead', value: mockAccounts.filter(a => a.status === 'Lead').length, color: '#3b82f6' },
    { name: 'Prospect', value: mockAccounts.filter(a => a.status === 'Prospect').length, color: '#8b5cf6' },
    { name: 'Customer', value: mockAccounts.filter(a => a.status === 'Customer').length, color: '#10b981' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your sales overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pipeline Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${(totalPipelineValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">{openDeals.length} open deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Commission Earned</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${(commission.salesperson / 1000).toFixed(1)}K</div>
            <p className="text-xs text-gray-500 mt-1">85% of ${(totalWonValue / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Accounts</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockAccounts.length}</div>
            <p className="text-xs text-gray-500 mt-1">{mockAccounts.filter(a => a.status === 'Customer').length} customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Proposals</CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500 mt-1">1 sent, 1 draft</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pipeline by Stage */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pipeline by Stage</CardTitle>
            <CardDescription>Deal value across pipeline stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Account Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Distribution by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accountStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest interactions and updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-600">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.accountName} • {activity.contactName}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Opportunities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Opportunities</CardTitle>
                <CardDescription>High-value deals in progress</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('pipeline')}>
                View Pipeline
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openDeals.slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{deal.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {deal.stage}
                      </Badge>
                      <span className="text-xs text-gray-500">{deal.accountName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(deal.value / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-500">{deal.probability}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
