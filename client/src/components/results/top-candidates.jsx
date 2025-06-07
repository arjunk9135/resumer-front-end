import { User, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TopCandidates({ candidates }) {
  // Take the top 5 candidates by match score
  const topCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
  
  // Helper function to get formatted skills
  const getFormattedSkills = (skills) => {
    if (typeof skills === 'string') {
      return skills.split(',').map(s => s.trim());
    }
    return Array.isArray(skills) ? skills : [];
  };
  
  // Helper function to get position badge
  const getPositionBadge = (position) => {
    if (position === 0) return <Badge className="bg-yellow-500">#1</Badge>;
    if (position === 1) return <Badge className="bg-gray-400">#2</Badge>;
    if (position === 2) return <Badge className="bg-amber-700">#3</Badge>;
    return <Badge variant="outline">#{position + 1}</Badge>;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Top Candidates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCandidates.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No candidates found
            </div>
          ) : (
            topCandidates.map((candidate, index) => (
              <div 
                key={candidate.id}
                className={`p-4 rounded-lg flex items-start gap-4 ${
                  index === 0 ? 'bg-yellow-50 border border-yellow-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {index === 0 ? <Star className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{candidate.name}</h3>
                    {getPositionBadge(index)}
                    <div className="ml-auto">
                      <span className={`font-bold ${
                        candidate.matchScore >= 90 ? 'text-green-600' :
                        candidate.matchScore >= 80 ? 'text-blue-600' :
                        'text-gray-700'
                      }`}>
                        {candidate.matchScore}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    {candidate.experience} • {candidate.education} • {candidate.location}
                  </p>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {getFormattedSkills(candidate.skills).slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="mr-1 mb-1">
                        {skill}
                      </Badge>
                    ))}
                    {getFormattedSkills(candidate.skills).length > 3 && (
                      <Badge variant="outline" className="bg-gray-50">
                        +{getFormattedSkills(candidate.skills).length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                      View Resume
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}