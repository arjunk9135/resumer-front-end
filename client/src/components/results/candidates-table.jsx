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
  const filteredCandidates = candidates.filter((candidate) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.name?.toLowerCase().includes(searchLower) ||
      candidate.email?.toLowerCase().includes(searchLower) ||
      candidate.location?.toLowerCase().includes(searchLower) ||
      (Array.isArray(candidate.skills) &&
        candidate.skills.some((skill) => skill.toLowerCase().includes(searchLower)))
    );
  });

  // Sort candidates based on sort type
// Sort candidates based on sort type
const sortedCandidates = [...filteredCandidates].sort((a, b) => {
  switch (sortType) {
    case 'match':
      return (b.matchScore || 0) - (a.matchScore || 0);

    case 'experience':
      const expA = parseFloat(a.experience?.match(/[\d.]+/)?.[0] || '0');
      const expB = parseFloat(b.experience?.match(/[\d.]+/)?.[0] || '0');
      return expB - expA;

    case 'education':
      const eduRank = { PhD: 3, Master: 2, Bachelor: 1 };
      const rankA = eduRank[a.education] || 0;
      const rankB = eduRank[b.education] || 0;
      return rankB - rankA;

    case 'name':
      return a.name?.localeCompare(b.name || '') || 0;

    case 'rank':
      const rankAVal = a.evaluation?.overall?.ranking || Infinity;
      const rankBVal = b.evaluation?.overall?.ranking || Infinity;
      return rankAVal - rankBVal; // lower rank is better

    default:
      // Sort by overall score (highest to lowest)
      const scoreA = a?.evaluation?.overall?.score || 0;
      const scoreB = b?.evaluation?.overall?.score || 0;
      return scoreB - scoreA;
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
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 70) return 'bg-blue-500 text-white';
    if (score >= 50) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  // Get match score label
  const getMatchScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  return (
    <Card className="shadow-lg rounded-xl">
      
<Card className="shadow-lg rounded-xl">
  {/* Header Section with Gradient Background */}
  <CardHeader className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-t-xl">
    <CardTitle className="font-display font-semibold text-lg">
      Candidates ({filteredCandidates.length})
    </CardTitle>
    <div className="relative mt-2 sm:mt-0 w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
      <Input
        placeholder="Search candidates..."
        className="pl-9 bg-gray-50 text-gray-800"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </CardHeader>

  {/* Table Content */}
  <CardContent className="p-0 bg-gray-50 text-gray-800">
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
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {currentCandidates.map((candidate, index) => (
                <tr key={candidate.id || index} className="hover:bg-gray-100">
                  <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage
                          src={`https://source.unsplash.com/random/100x100?face&${index}`}
                          alt={candidate.name}
                        />
                        <AvatarFallback>{candidate.name?.[0] || 'C'}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-800">{candidate.name}</div>
                        <div className="text-sm text-gray-500">
                          {candidate.education || 'Unknown education'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{candidate.email}</div>
                    <div className="text-sm text-gray-500">{candidate.contact || 'No phone provided'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{candidate.experience || '0'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{candidate.location || 'Unknown'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchScoreColor(
                        candidate?.evaluation?.overall?.score * 10
                      )}`}
                    >
                      <span className="font-bold mr-1">
                        {candidate?.evaluation?.overall?.score * 10}%
                      </span>
                      {getMatchScoreLabel(candidate?.evaluation?.overall?.score * 10)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(candidate.skills) ? (
                        <>
                          {candidate.skills.slice(0, 3).map((skill, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-blue-500 text-white hover:bg-blue-600"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="outline" className="bg-gray-200 text-gray-600">
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
                      className="text-indigo-500 hover:text-indigo-600 mr-1"
                      onClick={() => handleViewDetails(candidate)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-500 hover:text-green-600"
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
      </>
    )}
  </CardContent>
</Card>

    </Card>
  );
}