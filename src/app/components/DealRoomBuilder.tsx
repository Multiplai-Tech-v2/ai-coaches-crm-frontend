import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, GripVertical, FileText, Video, Link2, Quote, Briefcase, DollarSign, Eye, Download, Clock, Users, BarChart3, Share2, Settings, Copy } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import type { DealRoom, DealRoomSection, DealRoomItem } from '@/app/data/mockData';

interface DealRoomBuilderProps {
  dealRoom: DealRoom | null;
  onBack: () => void;
}

export function DealRoomBuilder({ dealRoom, onBack }: DealRoomBuilderProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'analytics' | 'settings'>('content');
  const [selectedSection, setSelectedSection] = useState<DealRoomSection | null>(
    dealRoom?.sections[0] || null
  );
  
  // Local state for editing deal room settings
  const [roomName, setRoomName] = useState(dealRoom?.name || '');
  const [expiresDate, setExpiresDate] = useState(dealRoom?.expiresDate || '');

  const getItemIcon = (type: DealRoomItem['type']) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'link': return Link2;
      case 'testimonial': return Quote;
      case 'case-study': return Briefcase;
      case 'pricing': return DollarSign;
      default: return FileText;
    }
  };

  const getItemColor = (type: DealRoomItem['type']) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'link': return 'bg-green-100 text-green-700';
      case 'testimonial': return 'bg-yellow-100 text-yellow-700';
      case 'case-study': return 'bg-orange-100 text-orange-700';
      case 'pricing': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  const copyLink = () => {
    if (dealRoom) {
      navigator.clipboard.writeText(dealRoom.accessLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Deal Rooms
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {dealRoom ? dealRoom.name : 'New Deal Room'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {dealRoom ? dealRoom.accountName : 'Create a new deal room'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {dealRoom && (
              <>
                <Button variant="outline" onClick={copyLink}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Link
                </Button>
                <Badge className="bg-green-100 text-green-700 border-green-200 border">
                  {dealRoom.status}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Content & Structure
          </button>
          {dealRoom && (
            <>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  Analytics
                  <Badge variant="outline" className="text-xs">
                    {dealRoom.analytics.totalViews} views
                  </Badge>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Sections Sidebar */}
          <div className="col-span-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sections</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {dealRoom?.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedSection?.id === section.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{section.title}</p>
                        <p className="text-xs text-gray-600">{section.items.length} items</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="col-span-9">
            {selectedSection ? (
              <div className="bg-white border border-gray-200 rounded-lg">
                {/* Section Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Input
                        value={selectedSection.title}
                        className="text-xl font-semibold border-0 px-0 focus:ring-0"
                        placeholder="Section Title"
                      />
                      {selectedSection.description && (
                        <p className="text-sm text-gray-600 mt-2">{selectedSection.description}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content Item
                  </Button>
                </div>

                {/* Items List */}
                <div className="p-6 space-y-3">
                  {selectedSection.items.map((item) => {
                    const Icon = getItemIcon(item.type);
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getItemColor(item.type)}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            {item.fileName && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {item.fileName}
                              </span>
                            )}
                            {item.fileSize && (
                              <span>{item.fileSize}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {item.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {item.downloads} downloads
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {selectedSection.items.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No content items yet</p>
                      <p className="text-sm mt-1">Add documents, videos, or other content</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Section</h3>
                <p className="text-gray-600">Choose a section from the sidebar to manage its content</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && dealRoom && (
        <div className="space-y-6">
          {/* Overview Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Views</p>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{dealRoom.analytics.totalViews}</p>
              <p className="text-xs text-gray-500 mt-1">Across all content</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{dealRoom.analytics.uniqueVisitors}</p>
              <p className="text-xs text-gray-500 mt-1">Individual contacts</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Avg. Time Spent</p>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(dealRoom.analytics.averageTimeSpent)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per visitor</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Downloads</p>
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {dealRoom.sections.reduce((sum, section) => 
                  sum + section.items.reduce((itemSum, item) => itemSum + item.downloads, 0), 0
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">Files downloaded</p>
            </div>
          </div>

          {/* Visitor Activity */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Visitor Activity</h3>
              <p className="text-sm text-gray-600 mt-1">Detailed engagement by contact</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dealRoom.analytics.viewsByContact.map((viewer) => (
                  <div key={viewer.contactId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {viewer.contactName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{viewer.contactName}</h4>
                          <p className="text-sm text-gray-600">{viewer.contactEmail}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Total Views</p>
                        <p className="text-xl font-semibold text-gray-900">{viewer.totalViews}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Time Spent</p>
                        <p className="text-xl font-semibold text-gray-900">{formatTime(viewer.timeSpent)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Items Viewed</p>
                        <p className="text-xl font-semibold text-gray-900">{viewer.itemsViewed.length}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Downloads</p>
                        <p className="text-xl font-semibold text-gray-900">{viewer.downloads.length}</p>
                      </div>
                    </div>

                    {/* Visit Timeline */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
                      <span>First viewed: {new Date(viewer.firstViewed).toLocaleString()}</span>
                      <span>Last viewed: {new Date(viewer.lastViewed).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Engagement */}
          {dealRoom.analytics.contentEngagement.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Content Engagement</h3>
                <p className="text-sm text-gray-600 mt-1">Performance by content item</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {dealRoom.analytics.contentEngagement.map((content) => {
                    const Icon = getItemIcon(content.itemType as DealRoomItem['type']);
                    return (
                      <div key={content.itemId} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getItemColor(content.itemType as DealRoomItem['type'])}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{content.itemTitle}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {content.downloads} downloads
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(content.averageTimeSpent)} avg.
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              {content.viewRate}% view rate
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && dealRoom && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Deal Room Settings</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Room Name</Label>
                <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label>Access Link</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={dealRoom.accessLink} readOnly />
                  <Button variant="outline" onClick={copyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Expiration Date</Label>
                <Input type="date" value={expiresDate} onChange={(e) => setExpiresDate(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label>Theme</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1">
                  <option value="default">Default</option>
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              <div>
                <Label>Status</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1">
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}