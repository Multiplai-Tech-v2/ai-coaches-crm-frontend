import { useState } from 'react';
import { FileText, Plus, Search, Eye, CheckCircle, Clock, Send, XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { mockProposals } from '@/app/data/mockData';
import { ProposalBuilder } from '@/app/components/ProposalBuilder';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function Proposals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [showProposalBuilder, setShowProposalBuilder] = useState(false);

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = 
      proposal.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-blue-100 text-blue-700';
      case 'Sent':
        return 'bg-purple-100 text-purple-700';
      case 'Viewed':
        return 'bg-indigo-100 text-indigo-700';
      case 'Accepted':
        return 'bg-green-100 text-green-700';
      case 'Declined':
        return 'bg-red-100 text-red-700';
      case 'Expired':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'Sent':
      case 'Viewed':
        return <Send className="w-4 h-4" />;
      case 'Draft':
      case 'Pending Approval':
        return <Clock className="w-4 h-4" />;
      case 'Declined':
      case 'Expired':
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const proposal = mockProposals.find(p => p.id === selectedProposal);

  const handleSaveProposal = (proposalData: any) => {
    console.log('Saving proposal:', proposalData);
    // Here you would typically save the proposal to your backend
    setShowProposalBuilder(false);
  };

  return (
    <div className="p-8">
      {/* Proposal Builder Modal */}
      {showProposalBuilder && (
        <ProposalBuilder
          onClose={() => setShowProposalBuilder(false)}
          onSave={handleSaveProposal}
        />
      )}
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
            <p className="text-gray-500 mt-1">Create and manage customer proposals</p>
          </div>
          <Button onClick={() => setShowProposalBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Viewed">Viewed</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(mockProposals.reduce((sum, p) => sum + p.totalValue, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockProposals.filter(p => ['Sent', 'Viewed'].includes(p.status)).length}
              </p>
            </div>
            <Send className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockProposals.filter(p => p.status === 'Accepted').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockProposals.filter(p => p.status === 'Draft').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <Card key={proposal.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{proposal.proposalNumber}</h3>
                  <Badge className={getStatusColor(proposal.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(proposal.status)}
                      {proposal.status}
                    </span>
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{proposal.accountName}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-sm font-semibold text-gray-900">${proposal.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="text-sm font-semibold text-gray-900">{proposal.discount}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{proposal.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="text-sm text-gray-900">{proposal.validUntil}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {proposal.sentDate && <span>Sent: {proposal.sentDate}</span>}
                  {proposal.viewedDate && <span>Viewed: {proposal.viewedDate}</span>}
                  {proposal.acceptedDate && <span>Accepted: {proposal.acceptedDate}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProposal(proposal.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{proposal.proposalNumber}</DialogTitle>
                      <DialogDescription>{proposal.accountName}</DialogDescription>
                    </DialogHeader>
                    {proposal && (
                      <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Value</p>
                            <p className="text-lg font-bold text-gray-900">${proposal.totalValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Discount</p>
                            <p className="text-lg font-semibold text-gray-900">{proposal.discount}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Valid Until</p>
                            <p className="text-lg text-gray-900">{proposal.validUntil}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Line Items</h4>
                          <div className="space-y-3">
                            {proposal.items.map((item, index) => (
                              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                  </div>
                                  <p className="text-lg font-bold text-gray-900">${item.total.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>Unit Price: ${item.unitPrice.toLocaleString()}</span>
                                  {item.discount > 0 && (
                                    <span className="text-orange-600">Discount: {item.discount}%</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${proposal.totalValue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                {proposal.status === 'Draft' && (
                  <Button size="sm">Edit</Button>
                )}
                {proposal.status === 'Approved' && (
                  <Button size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}