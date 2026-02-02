import { useState } from 'react';
import { Plus, FolderOpen, Eye, Download, Clock, Users, ExternalLink, BarChart3, Link2, FileText, Video, Star, DollarSign, Search, Filter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { DealRoomBuilder } from '@/app/components/DealRoomBuilder';
import { mockDealRooms, type DealRoom } from '@/app/data/mockData';

export function DealRooms() {
  const [dealRooms, setDealRooms] = useState<DealRoom[]>(mockDealRooms);
  const [selectedRoom, setSelectedRoom] = useState<DealRoom | null>(null);
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Draft' | 'Active' | 'Archived'>('all');

  const filteredRooms = dealRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: DealRoom['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Archived': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  const handleCreateRoom = () => {
    setSelectedRoom(null);
    setView('builder');
  };

  const handleEditRoom = (room: DealRoom) => {
    setSelectedRoom(room);
    setView('builder');
  };

  const handleBack = () => {
    setView('list');
    setSelectedRoom(null);
  };

  if (view === 'builder') {
    return <DealRoomBuilder dealRoom={selectedRoom} onBack={handleBack} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deal Rooms</h1>
            <p className="text-sm text-gray-600 mt-1">Share curated content with prospects and track engagement</p>
          </div>
          <Button onClick={handleCreateRoom} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Deal Room
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deal Rooms</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{dealRooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dealRooms.reduce((sum, room) => sum + room.analytics.totalViews, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dealRooms.reduce((sum, room) => sum + room.analytics.uniqueVisitors, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Time Spent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.round(dealRooms.reduce((sum, room) => sum + room.analytics.averageTimeSpent, 0) / dealRooms.length / 60)}m
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search deal rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deal Rooms Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRooms.map(room => {
          const totalItems = room.sections.reduce((sum, section) => sum + section.items.length, 0);
          const totalDownloads = room.sections.reduce((sum, section) => 
            sum + section.items.reduce((itemSum, item) => itemSum + item.downloads, 0), 0
          );

          return (
            <div key={room.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      <Badge className={`${getStatusColor(room.status)} border`}>
                        {room.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {room.accountName}
                      </span>
                      {room.dealName && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {room.dealName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {room.sharedWith.length} contacts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(room.accessLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Room
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRoom(room)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Views</p>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">{room.analytics.totalViews}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Visitors</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-semibold text-gray-900">{room.analytics.uniqueVisitors}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Downloads</p>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-600" />
                      <span className="text-lg font-semibold text-gray-900">{totalDownloads}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Avg. Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-lg font-semibold text-gray-900">{formatTime(room.analytics.averageTimeSpent)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Content Items</p>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-lg font-semibold text-gray-900">{totalItems}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {room.analytics.viewsByContact.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Recent Activity</p>
                    <div className="space-y-2">
                      {room.analytics.viewsByContact.slice(0, 3).map(viewer => (
                        <div key={viewer.contactId} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {viewer.contactName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{viewer.contactName}</p>
                              <p className="text-xs text-gray-600">
                                {viewer.totalViews} views · {viewer.downloads.length} downloads · {formatTime(viewer.timeSpent)} spent
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last viewed: {new Date(viewer.lastViewed).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sections Preview */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">{room.sections.length} Sections</p>
                  <div className="flex flex-wrap gap-2">
                    {room.sections.map(section => (
                      <Badge key={section.id} variant="outline" className="text-xs">
                        {section.title} ({section.items.length})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRooms.length === 0 && (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deal Rooms Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first deal room to start sharing content with prospects'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={handleCreateRoom} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Deal Room
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Building2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
