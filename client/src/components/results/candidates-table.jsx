import { useState } from 'react';
import { Search, Eye, Mail , Users} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CandidatesTable({ candidates = [], loading, sortType, setSortType }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10);
  const { toast } = useToast();

  const normalized = candidates.map((c, i) => {
    return {
      id: c.resume_id || i,
      name: c.candidate_name || `Candidate ${i + 1}`,
      email: c.email || 'N/A',
      contact: c.contact || 'N/A',
      experience: typeof c.experience === 'number' ? `${c.experience} yrs` : c.experience || 'N/A',
      location: c.location || 'Unknown',
      education: c.education || 'N/A',
      skills: typeof c.skills === 'string' ? c.skills.split(',').map(s => s.trim()) : [],
      matchScore: c.evaluation?.overall?.score ? c.evaluation.overall.score * 10 : 0,
    };
  });

  const filteredCandidates = normalized.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.location.toLowerCase().includes(search) ||
      c.skills.some(skill => skill.toLowerCase().includes(search))
    );
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortType) {
      case 'match':
        return b.matchScore - a.matchScore;
      case 'experience':
        return parseFloat(b.experience) - parseFloat(a.experience);
      case 'education':
        return b.education.localeCompare(a.education);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const indexOfLast = currentPage * candidatesPerPage;
  const indexOfFirst = indexOfLast - candidatesPerPage;
  const currentPageCandidates = sortedCandidates.slice(indexOfFirst, indexOfLast);

  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-purple-600 text-white';
    if (score >= 70) return 'bg-indigo-500 text-white';
    if (score >= 50) return 'bg-violet-400 text-white';
    return 'bg-pink-400 text-white';
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  return (
    <Card className="shadow-lg rounded-xl border border-[#E0DFFF] bg-gradient-to-br from-[#F7F6FF] to-[#ECECFF]">
      <CardHeader className="px-6 py-5 border-b border-[#D8D7FF] flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#5B6CFF] to-[#7B8CFF] text-white rounded-t-xl">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 Candidates ({filteredCandidates?.length})
               </CardTitle>
        <div className="flex items-center gap-4">
          <Select value={sortType} onValueChange={setSortType}>
            <SelectTrigger className="w-[180px] bg-white/50 border border-violet-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <Input
              className="pl-9 bg-white border border-violet-200"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading candidates...</div>
        ) : filteredCandidates.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No candidates found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-violet-200">
              <thead>
                <tr className="bg-[#E9E7FF] text-violet-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Skills</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageCandidates.map((c, index) => (
                  <tr key={c.id} className="hover:bg-[#F0EEFF]">
                    <td className="px-4 py-4">{indexOfFirst + index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 rounded-full flex items-center justify-center">
  <AvatarFallback className="bg-[#5B6CFF] text-white font-semibold text-sm">
    {(() => {
      const words = c.name.split(' ');
      if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    })()}
  </AvatarFallback>
</Avatar>


                        <div className="ml-3">
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.education}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">{c.email}</div>
                      <div className="text-xs text-gray-500">{c.contact}</div>
                    </td>
                    <td className="px-4 py-4 text-sm">{c.experience}</td>
                    <td className="px-4 py-4 text-sm">{c.location}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-semibold ${getMatchColor(c.matchScore)}`}>
                        {c.matchScore}% — {getMatchLabel(c.matchScore)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} className="bg-violet-500 text-white">{skill}</Badge>
                        ))}
                        {c.skills.length > 3 && (
                          <Badge variant="outline" className="text-gray-600 bg-gray-200">
                            +{c.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Viewing', description: c.name })}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Contact', description: c.email })}>
                        <Mail className="h-4 w-4 mr-1" /> Contact
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
