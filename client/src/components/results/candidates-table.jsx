import { useState } from 'react';
import { Search, Eye, Mail } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function CandidatesTable({ candidates, loading, sortType }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10);
  const { toast } = useToast();
  
  // Filter candidates by search term
  const filteredCandidates = candidates.filter(candidate => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.name?.toLowerCase().includes(searchLower) ||
      candidate.email?.toLowerCase().includes(searchLower) ||
      candidate.location?.toLowerCase().includes(searchLower) ||
      (Array.isArray(candidate.skills) && 
        candidate.skills.some(skill => skill.toLowerCase().includes(searchLower)))
    );
  });
  
  // Sort candidates based on sort type
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortType) {
      case 'match':
        return b.matchScore - a.matchScore;
      case 'experience':
        // Extract numbers from experience strings
        const expA = parseFloat(a.experience?.match(/(\d+\.?\d*)/)?.[1] || '0');
        const expB = parseFloat(b.experience?.match(/(\d+\.?\d*)/)?.[1] || '0');
        return expB - expA;
      case 'education':
        const eduRank = { PhD: 3, Master: 2, Bachelor: 1 };
        const rankA = eduRank[a.education] || 0;
        const rankB = eduRank[b.education] || 0;
        return rankB - rankA;
      case 'name':
        return a.name?.localeCompare(b.name || '');
      default:
        return b.matchScore - a.matchScore;
    }
  });
  
  // Pagination
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = sortedCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  
  // Handle contact button click
  const handleContact = (candidate) => {
    toast({
      title: 'Contact initiated',
      description: `An email has been sent to ${candidate.email}`,
    });
  };
  
  // Handle view details click
  const handleViewDetails = (candidate) => {
    toast({
      title: 'Viewing candidate details',
      description: `Details for ${candidate.name}`,
    });
  };
  
  // Get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Get match score label
  const getMatchScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };
  
  return (
    <Card>
      <CardHeader className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="font-display font-semibold text-lg text-text">
          Candidates ({filteredCandidates.length})
        </CardTitle>
        <div className="relative mt-2 sm:mt-0 w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">Loading candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No candidates found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCandidates.map((candidate, index) => (
                    <tr key={candidate.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Avatar>
                              <AvatarImage 
                                src={`https://source.unsplash.com/random/100x100?face&${index}`} 
                                alt={candidate.name} 
                              />
                              <AvatarFallback>{candidate.name?.[0] || 'C'}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text">{candidate.name}</div>
                            <div className="text-sm text-gray-500">
                              {candidate.education || 'Unknown education'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-text">{candidate.email}</div>
                        <div className="text-sm text-gray-500">{candidate.phone || 'No phone provided'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-text">{candidate.experience || 'Unknown'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-text">{candidate.location || 'Unknown'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchScoreColor(candidate?.evaluation?.overall?.score*100)}`}>
                          <span className="font-bold mr-1">{candidate?.evaluation?.overall?.score*10}%</span> 
                          {getMatchScoreLabel(candidate?.evaluation?.overall?.score*10)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(candidate.skills) ? (
                            <>
                              {candidate.skills.slice(0, 3).map((skill, i) => (
                                <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 3 && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                  +{candidate.skills.length - 3}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary mr-1"
                          onClick={() => handleViewDetails(candidate)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => handleContact(candidate)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{indexOfFirstCandidate + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastCandidate, filteredCandidates.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredCandidates.length}</span> candidates
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className={currentPage === pageNumber ? "bg-primary text-white" : ""}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <Button variant="outline" size="sm" disabled>
                          ...
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
