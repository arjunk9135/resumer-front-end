import { User, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TopCandidates({ candidates }) {
  if (!Array.isArray(candidates)) return null;

  const topCandidates = candidates
    .filter(c => c?.evaluation?.overall?.score >= 7)
    .sort((a, b) => b.evaluation.overall.score - a.evaluation.overall.score)
    .slice(0, 5);

  const getFormattedSkills = (skills) => {
    if (typeof skills === 'string') {
      return skills.split(',').map(s => s.trim());
    }
    return Array.isArray(skills) ? skills : [];
  };

  const getPositionBadge = (position) => {
    const base = "text-white text-xs px-2 py-1 rounded-md font-semibold";
    if (position === 0) return <Badge className={`${base} bg-[#7B8CFF]`}>#1</Badge>;
    if (position === 1) return <Badge className={`${base} bg-[#5B6CFF]`}>#2</Badge>;
    if (position === 2) return <Badge className={`${base} bg-[#2F49D1]`}>#3</Badge>;
    return <Badge variant="outline" className="text-[#6E7B8A] border-[#E1E5F2]">#{position + 1}</Badge>;
  };

  return (
    <Card className="bg-white rounded-xl border border-[#E1E5F2]">
      <CardHeader className="pb-2 border-b border-[#E1E5F2]">
        <CardTitle className="text-lg font-semibold text-[#2F49D1] flex items-center gap-2">
          <Award className="h-5 w-5 text-[#7B8CFF]" />
          Top Candidates
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {topCandidates.length === 0 ? (
          <div className="text-center text-[#6E7B8A] py-6">
            No candidates scored 7 or above
          </div>
        ) : (
          topCandidates.map((candidate, index) => {
            const matchScore = candidate.evaluation.overall.score;
            const skills = getFormattedSkills(candidate.skills);

            return (
              <div
                key={candidate.resume_id}
                className={`rounded-lg p-4 flex items-start gap-4 transition-colors duration-200 ${
                  index === 0
                    ? 'bg-[#F4F7FE] border border-[#E1E5F2]'
                    : 'hover:bg-[#F4F7FE]'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-[#E1E5F2] text-[#2F49D1]' : 'bg-[#F4F7FE] text-[#6E7B8A]'
                  }`}>
                    {index === 0 ? <Star className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[#000]">{candidate.candidate_name}</h3>
                    {getPositionBadge(index)}
                    <div className="ml-auto font-bold text-[#44C97F]">
                      {matchScore}/10
                    </div>
                  </div>

                  <p className="text-sm text-[#6E7B8A]">
                    {candidate.experience} yrs • {candidate.education} • {candidate.location}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="border-[#E1E5F2] text-[#6E7B8A] bg-white">
                        {skill}
                      </Badge>
                    ))}
                    {skills.length > 3 && (
                      <Badge variant="outline" className="bg-[#F4F7FE] text-[#6E7B8A]">
                        +{skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-[#5B6CFF] p-0 h-auto text-sm"
                    >
                      View Resume
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
