import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Search, Filter, User } from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  // State for filters
  const [dateRange, setDateRange] = useState('all-time');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch analyses
  const { data: analyses = [] } = useQuery({
    queryKey: ['/api/analyses'],
  });
  
  // Filter analyses based on selected filters
  const filteredAnalyses = analyses.filter(analysis => {
    // Search filter
    if (searchQuery && !analysis.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !analysis.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (status !== 'all' && analysis.status !== status) {
      return false;
    }
    
    // Department filter
    if (department !== 'all' && analysis.department !== department) {
      return false;
    }
    
    // Date range filter (simplified for demo)
    if (dateRange !== 'all-time') {
      const analysisDate = new Date(analysis.createdAt);
      const now = new Date();
      
      if (dateRange === 'last-7' && (now - analysisDate) > 7 * 24 * 60 * 60 * 1000) {
        return false;
      } else if (dateRange === 'last-30' && (now - analysisDate) > 30 * 24 * 60 * 60 * 1000) {
        return false;
      } else if (dateRange === 'last-90' && (now - analysisDate) > 90 * 24 * 60 * 60 * 1000) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort analyses by date (newest first)
  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  return (
    <PageContainer title="Analysis History">
      <div className="space-y-6">
        {/* Search and Filter Row */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search history..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {/* History Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="last-7">Last 7 days</SelectItem>
                    <SelectItem value="last-30">Last 30 days</SelectItem>
                    <SelectItem value="last-90">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  className="h-10"
                  onClick={() => {
                    setDateRange('all-time');
                    setDepartment('all');
                    setStatus('all');
                    setSearchQuery('');
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* History Table */}
        <Card>
          <CardHeader className="px-6 py-5 border-b border-gray-100">
            <CardTitle className="font-display font-semibold text-lg text-text">
              All Analyses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAnalyses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">No analyses found matching your filters</p>
                <Button onClick={() => {
                  setDateRange('all-time');
                  setDepartment('all');
                  setStatus('all');
                  setSearchQuery('');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analysis Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedAnalyses.map(analysis => (
                      <tr key={analysis.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text">{analysis.jobTitle}</div>
                          <div className="text-xs text-gray-500">
                            {analysis.averageScore ? `Match Score: ${analysis.averageScore}%` : ''}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{analysis.department || 'Not specified'}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{analysis.candidateCount}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" alt="User" />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <div className="text-sm text-gray-900">Alex Johnson</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant={getStatusVariant(analysis.status)}>
                            {getStatusLabel(analysis.status)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/results/${analysis.id}`}>
                            <Button variant="link" className="text-primary">View</Button>
                          </Link>
                          <Button variant="link" className="text-gray-500">Export</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {filteredAnalyses.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAnalyses.length}</span> of <span className="font-medium">{analyses.length}</span> analyses
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
                    <Button variant="outline" size="sm" disabled>Next</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

// Helper functions
function getStatusVariant(status) {
  switch(status) {
    case 'completed': return 'success';
    case 'processing': return 'default';
    case 'queued': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'outline';
  }
}

function getStatusLabel(status) {
  switch(status) {
    case 'completed': return 'Completed';
    case 'processing': return 'Processing';
    case 'queued': return 'Queued';
    case 'failed': return 'Failed';
    default: return status;
  }
}
