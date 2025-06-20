import { useState } from 'react';
import {
  Star,
  Trophy,
  CheckCircle2,
  CircleHelp,
  XCircle,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TieredCandidates({ candidates }) {
  const [expandedTiers, setExpandedTiers] = useState({
    exceptional: true,
    strong: true,
    qualified: false,
    potential: false,
    notRecommended: false,
  });

  const getTier = (score) => {
    if (score >= 90) return 'exceptional';
    if (score >= 80) return 'strong';
    if (score >= 70) return 'qualified';
    if (score >= 60) return 'potential';
    return 'notRecommended';
  };

  const enrichedCandidates = candidates.map((c, i) => {
    const matchScore = c.evaluation?.overall?.score * 10 || 0;
    return {
      id: i,
      name: c.name.replace(/_/g, ' '),
      matchScore,
      tier: getTier(matchScore),
      experience: `${c.evaluation?.relevant_experience?.score}/10` || 'N/A',
      education: `${c.evaluation?.achievements?.score}/10` || 'N/A',
      location: `${c.evaluation?.professionalism?.score}/10` || 'N/A',
      clarity: `${c.evaluation?.clarity_and_structure?.score}/10` || 0,
      skills: [
        `Experience: ${c.evaluation?.relevant_experience?.score}/10`,
        `Skills Match: ${c.evaluation?.skills_match?.score}/10`,
      ],
    };
  });

  const candidatesByTier = enrichedCandidates.reduce((acc, candidate) => {
    const tier = candidate.tier;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(candidate);
    return acc;
  }, {});

  const tierConfig = {
    exceptional: {
      label: 'Exceptional Matches',
      description: 'These candidates closely match the job requirements',
      icon: Trophy,
      iconBg: 'bg-green-600',
      iconText: 'text-white',
      bgColor: 'bg-gradient-to-r from-green-100 via-green-50 to-white',
      textColor: 'text-green-800',
    },
    strong: {
      label: 'Strong Matches',
      description: 'These candidates match most of the job requirements',
      icon: Star,
      iconBg: 'bg-indigo-500',
      iconText: 'text-white',
      bgColor: 'bg-gradient-to-r from-indigo-100 via-indigo-50 to-white',
      textColor: 'text-indigo-800',
    },
    qualified: {
      label: 'Qualified Candidates',
      description: 'These candidates meet the minimum requirements',
      icon: CheckCircle2,
      iconBg: 'bg-purple-500',
      iconText: 'text-white',
      bgColor: 'bg-gradient-to-r from-purple-100 via-purple-50 to-white',
      textColor: 'text-purple-800',
    },
    potential: {
      label: 'Potential Fits',
      description: 'These candidates may need additional training',
      icon: CircleHelp,
      iconBg: 'bg-blue-500',
      iconText: 'text-white',
      bgColor: 'bg-gradient-to-r from-blue-100 via-blue-50 to-white',
      textColor: 'text-blue-800',
    },
    notRecommended: {
      label: 'Not Recommended',
      description: 'These candidates do not match the requirements',
      icon: XCircle,
      iconBg: 'bg-red-500',
      iconText: 'text-white',
      bgColor: 'bg-gradient-to-r from-red-100 via-red-50 to-white',
      textColor: 'text-red-800',
    },
  };

  const toggleTier = (tier) => {
    setExpandedTiers({
      ...expandedTiers,
      [tier]: !expandedTiers[tier],
    });
  };

  const renderTier = (tier) => {
    const config = tierConfig[tier];
    const candidatesInTier = candidatesByTier[tier] || [];
    const count = candidatesInTier.length;
    if (count === 0) return null;

    const Icon = config.icon;

    return (
      <div key={tier} className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
        <div
          className={`p-4 ${config.bgColor} flex items-center justify-between cursor-pointer rounded-t-xl`}
          onClick={() => toggleTier(tier)}
        >
          <div className="flex items-center">
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full shadow-md ${config.iconBg}`}
            >
              <Icon className={`h-5 w-5 ${config.iconText}`} />
            </div>
            <div className="ml-3">
              <h3 className={`font-medium ${config.textColor}`}>{config.label}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className={`text-sm font-medium ${config.textColor}`}>{count} candidates</span>
            </div>
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${config.textColor}`}>
              {expandedTiers[tier] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>

        {expandedTiers[tier] && (
          <div className="p-4 bg-white rounded-b-xl">
            <div className="grid grid-cols-1 gap-3">
              {candidatesInTier.map((candidate) => (
                <div key={candidate.id} className="p-3 bg-gray-50 rounded flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h4 className="font-medium text-sm text-gray-800">{candidate.name}</h4>
                      <Badge className="ml-2 bg-violet-500 text-white hover:bg-violet-600">
                        {candidate.matchScore}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Clarity: {candidate?.clarity} • Education Score: {candidate.education}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidate.skills.map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="mr-1 mb-1 text-xs border border-violet-300 text-violet-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex sm:flex-col items-center sm:items-end">
                    <Button variant="link" size="sm" className="h-auto p-0 text-indigo-600">
                      View Resume
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-lg rounded-xl border border-[#E0DFFF] bg-gradient-to-br from-[#F7F6FF] to-[#ECECFF]">
      <CardHeader className="pb-2 border-b border-[#D8D7FF] bg-gradient-to-r from-[#A79DFE] to-[#B3A7FF] text-white rounded-t-xl">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5" />
          Candidates by Tier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b">
          <span className="text-sm font-medium">Score Tiers:</span>
          <div className="flex items-center text-xs text-indigo-700">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            90-100% Exceptional
          </div>
          <div className="flex items-center text-xs text-green-700">
            <span className="w-3 h-3 rounded-full bg-indigo-500  mr-1"></span>
            80-89% Strong
          </div>
          <div className="flex items-center text-xs text-purple-700">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
            70-79% Qualified
          </div>
          <div className="flex items-center text-xs text-blue-700">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            60-69% Potential
          </div>
          <div className="flex items-center text-xs text-red-700">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            Below 60% Not Recommended
          </div>
        </div>
        {Object.keys(tierConfig).map((tier) => renderTier(tier))}
      </CardContent>
    </Card>
  );
}
