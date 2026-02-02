import { useState } from 'react';
import { Map, Search, UserPlus, CheckSquare, Building2, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Avatar } from '@/app/components/ui/avatar';
import { mockAccounts, mockSalespeople, Account } from '@/app/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

export function ListManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('Target');
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState('');

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.state?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'all' || account.region === regionFilter;
    const matchesCountry = countryFilter === 'all' || account.country === countryFilter;
    const matchesState = stateFilter === 'all' || account.state === stateFilter;
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesRegion && matchesCountry && matchesState && matchesStatus;
  });

  const toggleAccountSelection = (accountId: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
    } else {
      newSelected.add(accountId);
    }
    setSelectedAccounts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.size === filteredAccounts.length) {
      setSelectedAccounts(new Set());
    } else {
      setSelectedAccounts(new Set(filteredAccounts.map(a => a.id)));
    }
  };

  const handleAllocate = () => {
    if (selectedAccounts.size > 0) {
      setShowAllocationDialog(true);
    }
  };

  const confirmAllocation = () => {
    // In real implementation, this would update the backend
    console.log('Allocating', selectedAccounts.size, 'accounts to', selectedSalesperson);
    setShowAllocationDialog(false);
    setSelectedAccounts(new Set());
    setSelectedSalesperson('');
  };

  // Get unique values for filters
  const regions = Array.from(new Set(mockAccounts.map(a => a.region).filter(Boolean)));
  const countries = Array.from(new Set(mockAccounts.map(a => a.country).filter(Boolean)));
  const states = Array.from(new Set(mockAccounts.map(a => a.state).filter(Boolean)));

  // Calculate total contacts for selected accounts
  const totalContactsSelected = Array.from(selectedAccounts).reduce((sum, id) => {
    const account = mockAccounts.find(a => a.id === id);
    return sum + (account?.contactCount || 0);
  }, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">List Management</h1>
            <p className="text-gray-500 mt-1">Allocate target accounts to salespeople</p>
          </div>
          <Button 
            onClick={handleAllocate}
            disabled={selectedAccounts.size === 0}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Allocate ({selectedAccounts.size})
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region || ''}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country || ''}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="State/Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state || ''}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Target">Target</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
              <SelectItem value="Opportunity">Opportunity</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selection summary */}
        {selectedAccounts.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedAccounts.size} accounts selected ({totalContactsSelected} contacts)
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedAccounts(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Salespeople Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {mockSalespeople.map(sp => (
          <Card key={sp.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar 
                  name={sp.name}
                  initials={sp.initials}
                  color={sp.color}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-medium text-gray-900 truncate">{sp.name}</CardTitle>
                  <p className="text-xs text-gray-500 truncate">{sp.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Accounts:</span>
                  <span className="font-bold text-gray-900">{sp.accountsAssigned}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Contacts:</span>
                  <span className="font-bold text-gray-900">{sp.contactsAssigned}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accounts Table with Horizontal Scroll */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Target Accounts</CardTitle>
            <span className="text-sm text-gray-500">{filteredAccounts.length} accounts</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sticky left-0 bg-white z-10">
                    <Checkbox 
                      checked={selectedAccounts.size === filteredAccounts.length && filteredAccounts.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[200px] sticky left-12 bg-white z-10">Company</TableHead>
                  <TableHead className="min-w-[150px]">Industry</TableHead>
                  <TableHead className="min-w-[120px]">Employees</TableHead>
                  <TableHead className="min-w-[150px]">Investor</TableHead>
                  <TableHead className="min-w-[130px]">Investor Type</TableHead>
                  <TableHead className="min-w-[120px]">City</TableHead>
                  <TableHead className="min-w-[130px]">State/Province</TableHead>
                  <TableHead className="min-w-[130px]">Country</TableHead>
                  <TableHead className="min-w-[120px]">Region</TableHead>
                  <TableHead className="min-w-[100px]">Contacts</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id}
                    className={selectedAccounts.has(account.id) ? 'bg-blue-50' : ''}
                  >
                    <TableCell className="sticky left-0 bg-inherit z-10">
                      <Checkbox 
                        checked={selectedAccounts.has(account.id)}
                        onCheckedChange={() => toggleAccountSelection(account.id)}
                      />
                    </TableCell>
                    <TableCell className="sticky left-12 bg-inherit z-10">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <p className="text-xs text-gray-500">{account.revenue}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{account.industry}</TableCell>
                    <TableCell className="text-sm text-gray-600">{account.employeeCount}</TableCell>
                    <TableCell className="text-sm text-gray-600">{account.investor || '-'}</TableCell>
                    <TableCell>
                      {account.investorType && (
                        <Badge 
                          variant="outline"
                          className="text-xs"
                        >
                          {account.investorType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{account.city}</TableCell>
                    <TableCell className="text-sm text-gray-600">{account.state}</TableCell>
                    <TableCell className="text-sm text-gray-600">{account.country}</TableCell>
                    <TableCell className="text-sm text-gray-600">{account.region}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{account.contactCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{account.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${account.assignedTo ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}`}>
                        {account.assignedTo || 'Unassigned'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allocation Dialog */}
      <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Accounts</DialogTitle>
            <DialogDescription>
              Assign {selectedAccounts.size} accounts ({totalContactsSelected} contacts) to a salesperson
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Salesperson
              </label>
              <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a salesperson..." />
                </SelectTrigger>
                <SelectContent>
                  {mockSalespeople.map(sp => (
                    <SelectItem key={sp.id} value={sp.name}>
                      <div className="flex items-center gap-3">
                        <Avatar 
                          name={sp.name}
                          initials={sp.initials}
                          color={sp.color}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{sp.name}</span>
                          <span className="text-xs text-gray-500">
                            Currently: {sp.accountsAssigned} accounts, {sp.contactsAssigned} contacts
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSalesperson && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">After allocation:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Selected salesperson will have access to these accounts</p>
                  <p>• They can register deals and track all communications</p>
                  <p>• Commission split: 85% salesperson, 10% operations, 5% advertising</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAllocation}
              disabled={!selectedSalesperson}
            >
              Confirm Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
