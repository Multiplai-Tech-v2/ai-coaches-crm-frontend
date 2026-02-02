import { useState } from 'react';
import { TrendingUp, Search, Plus, DollarSign, Calendar, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { mockDeals } from '@/app/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

export function Pipeline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filteredDeals = mockDeals.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Suspect':
        return 'bg-gray-100 text-gray-700';
      case 'Lead':
        return 'bg-blue-100 text-blue-700';
      case 'Prospect':
        return 'bg-purple-100 text-purple-700';
      case 'Opportunity':
        return 'bg-orange-100 text-orange-700';
      case 'Customer':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Won':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Lost':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'On Hold':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
    }
  };

  // Group deals by stage for Kanban view
  const stages = ['Suspect', 'Lead', 'Prospect', 'Opportunity', 'Customer'];
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter(d => d.stage === stage);
    return acc;
  }, {} as Record<string, typeof filteredDeals>);

  // Calculate stage values
  const stageValues = stages.map(stage => ({
    stage,
    count: dealsByStage[stage].length,
    value: dealsByStage[stage].reduce((sum, deal) => sum + deal.value, 0)
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pipeline</h1>
            <p className="text-gray-500 mt-1">Track and manage your sales opportunities</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Suspect">Suspect</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
              <SelectItem value="Opportunity">Opportunity</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {stageValues.map(({ stage, count, value }) => (
          <Card key={stage}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{stage}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500 mt-1">${(value / 1000).toFixed(0)}K</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{deal.name}</h3>
                    {getStatusIcon(deal.status)}
                    {deal.isRegistered && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Registered
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{deal.accountName}</p>
                  
                  <div className="flex items-center gap-4">
                    <Badge className={getStageColor(deal.stage)}>
                      {deal.stage}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      ${(deal.value / 1000).toFixed(0)}K
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Close: {deal.closeDate}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {deal.stakeholderCount} stakeholders
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-6 text-sm">
                    <span className="text-gray-500">Owner: <span className="text-gray-900">{deal.owner}</span></span>
                    <span className="text-gray-500">Probability: <span className="text-gray-900">{deal.probability}%</span></span>
                    {deal.primaryContact && (
                      <span className="text-gray-500">Primary: <span className="text-gray-900">{deal.primaryContact}</span></span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Update Stage</Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${deal.probability}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stages.map(stage => (
              <Card key={stage} className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-gray-700">
                    {stage}
                    <span className="ml-2 text-gray-500">({dealsByStage[stage].length})</span>
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    ${(dealsByStage[stage].reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(0)}K
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dealsByStage[stage].map(deal => (
                    <Card key={deal.id} className="p-4 bg-white hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-medium text-sm text-gray-900 mb-2">{deal.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{deal.accountName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          ${(deal.value / 1000).toFixed(0)}K
                        </span>
                        <span className="text-xs text-gray-500">{deal.probability}%</span>
                      </div>
                      {deal.isRegistered && (
                        <Badge variant="outline" className="text-xs mt-2">
                          Registered
                        </Badge>
                      )}
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
