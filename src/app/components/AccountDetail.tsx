import { ArrowLeft, Building2, Globe, MapPin, Users, Mail, Phone, Calendar, TrendingUp, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { mockAccounts, mockContacts, mockDeals, mockActivities } from '@/app/data/mockData';
import { OrgChartFlow } from '@/app/components/OrgChartFlow';
import { useState } from 'react';

interface AccountDetailProps {
  accountId: string;
  onBack: () => void;
}

export function AccountDetail({ accountId, onBack }: AccountDetailProps) {
  const account = mockAccounts.find(a => a.id === accountId);
  const contacts = mockContacts.filter(c => c.accountId === accountId);
  const deals = mockDeals.filter(d => d.accountId === accountId);
  const activities = mockActivities.filter(a => a.accountId === accountId);

  if (!account) {
    return <div className="p-8">Account not found</div>;
  }

  const getStakeholderColor = (role?: string) => {
    switch (role) {
      case 'Economic Buyer':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Champion':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Decision Maker':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Blocker':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Influencer':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Technical Evaluator':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRelationshipColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Build org chart hierarchy
  const ceoContact = contacts.find(c => !c.reportsTo);
  const directReports = contacts.filter(c => c.reportsTo === ceoContact?.id);

  const [orgChartFlow, setOrgChartFlow] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Accounts
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{account.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={`${getStakeholderColor(account.status)}`}>
                  {account.status}
                </Badge>
                <span className="text-sm text-gray-500">{account.industry}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Edit Account</Button>
            <Button>New Deal</Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Deals</p>
                <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Employees</p>
                <p className="text-xl font-bold text-gray-900">{account.employeeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-xl font-bold text-gray-900">{account.revenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="org-chart" className="space-y-6">
        <TabsList>
          <TabsTrigger value="org-chart">Org Chart</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Organizational Chart */}
        <TabsContent value="org-chart" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Organizational Chart</CardTitle>
                  <CardDescription>
                    Visual representation of key stakeholders and reporting relationships
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={orgChartFlow ? "outline" : "default"}
                    size="sm"
                    onClick={() => setOrgChartFlow(false)}
                  >
                    Classic View
                  </Button>
                  <Button 
                    variant={orgChartFlow ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrgChartFlow(true)}
                  >
                    Flow View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No contacts added yet</p>
                </div>
              ) : orgChartFlow ? (
                <OrgChartFlow contacts={contacts} account={account} mode="hierarchy" />
              ) : (
                <div className="space-y-8">
                  {/* CEO Level */}
                  {ceoContact && (
                    <div className="flex flex-col items-center">
                      <div className="w-80 p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {ceoContact.firstName} {ceoContact.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{ceoContact.title}</p>
                            </div>
                          </div>
                          {ceoContact.relationshipScore && (
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getRelationshipColor(ceoContact.relationshipScore)}`} />
                              <span className="text-xs font-medium text-gray-600">{ceoContact.relationshipScore}/10</span>
                            </div>
                          )}
                        </div>
                        {ceoContact.stakeholderRole && (
                          <Badge className={`${getStakeholderColor(ceoContact.stakeholderRole)} text-xs`}>
                            {ceoContact.stakeholderRole}
                          </Badge>
                        )}
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            {ceoContact.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            {ceoContact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct Reports */}
                  {directReports.length > 0 && (
                    <>
                      <div className="flex justify-center">
                        <div className="w-px h-8 bg-gray-300" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {directReports.map((contact) => {
                          const subordinates = contacts.filter(c => c.reportsTo === contact.id);
                          
                          return (
                            <div key={contact.id} className="flex flex-col items-center">
                              <div className="w-full p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                      <User className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900 text-sm">
                                        {contact.firstName} {contact.lastName}
                                      </p>
                                      <p className="text-xs text-gray-600">{contact.title}</p>
                                    </div>
                                  </div>
                                  {contact.relationshipScore && (
                                    <div className="flex items-center gap-1">
                                      <div className={`w-2 h-2 rounded-full ${getRelationshipColor(contact.relationshipScore)}`} />
                                      <span className="text-xs font-medium text-gray-600">{contact.relationshipScore}/10</span>
                                    </div>
                                  )}
                                </div>
                                {contact.stakeholderRole && (
                                  <Badge className={`${getStakeholderColor(contact.stakeholderRole)} text-xs`}>
                                    {contact.stakeholderRole}
                                  </Badge>
                                )}
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{contact.email}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Subordinates */}
                              {subordinates.length > 0 && (
                                <>
                                  <div className="w-px h-6 bg-gray-300" />
                                  <div className="w-full space-y-3">
                                    {subordinates.map((sub) => (
                                      <div key={sub.id} className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                              <User className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div>
                                              <p className="font-medium text-gray-900 text-xs">
                                                {sub.firstName} {sub.lastName}
                                              </p>
                                              <p className="text-xs text-gray-500">{sub.title}</p>
                                            </div>
                                          </div>
                                          {sub.relationshipScore && (
                                            <div className={`w-2 h-2 rounded-full ${getRelationshipColor(sub.relationshipScore)}`} />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Legend */}
              {contacts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-600">Strong (8-10)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-xs text-gray-600">Good (6-7)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-xs text-gray-600">Fair (4-5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-gray-600">Weak (1-3)</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>All contacts at this account</CardDescription>
                </div>
                <Button>Add Contact</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {contact.stakeholderRole && (
                            <Badge className={`${getStakeholderColor(contact.stakeholderRole)} text-xs`}>
                              {contact.stakeholderRole}
                            </Badge>
                          )}
                          {contact.relationshipScore && (
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getRelationshipColor(contact.relationshipScore)}`} />
                              <span className="text-xs text-gray-500">Relationship: {contact.relationshipScore}/10</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      {contact.lastContact && (
                        <p className="text-xs text-gray-500 mt-1">Last contact: {contact.lastContact}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Deals</CardTitle>
                  <CardDescription>All opportunities at this account</CardDescription>
                </div>
                <Button>Create Deal</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{deal.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{deal.stage}</Badge>
                        <Badge variant={deal.status === 'Won' ? 'default' : 'outline'}>
                          {deal.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${(deal.value / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-gray-500">Close: {deal.closeDate}</p>
                      <p className="text-sm text-gray-500">{deal.probability}% probability</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {activity.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'call' && <Phone className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="w-px h-full bg-gray-200 mt-2" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">{activity.contactName}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Company information and metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Company Info</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Industry</p>
                      <p className="text-sm font-medium text-gray-900">{account.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employee Count</p>
                      <p className="text-sm font-medium text-gray-900">{account.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Annual Revenue</p>
                      <p className="text-sm font-medium text-gray-900">{account.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <a href={`https://${account.website}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {account.website}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{account.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">CRM Info</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Account Owner</p>
                      <p className="text-sm font-medium text-gray-900">{account.owner}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <Badge className={getStakeholderColor(account.status)}>
                        {account.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Activity</p>
                      <p className="text-sm font-medium text-gray-900">{account.lastActivity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}