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
      iconBg: 'bg-[#44C97F]',
      iconText: 'text-white',
      bgColor: 'bg-green-50',
      textColor: 'text-[#44C97F]',
      borderColor: 'border-green-200',
    },
    strong: {
      label: 'Strong Matches',
      description: 'These candidates match most of the job requirements',
      icon: Star,
      iconBg: 'bg-[#2F49D1]',
      iconText: 'text-white',
      bgColor: 'bg-[#F4F7FE]',
      textColor: 'text-[#2F49D1]',
      borderColor: 'border-[#E1E5F2]',
    },
    qualified: {
      label: 'Qualified Candidates',
      description: 'These candidates meet the minimum requirements',
      icon: CheckCircle2,
      iconBg: 'bg-[#5B6CFF]',
      iconText: 'text-white',
      bgColor: 'bg-[#F4F7FE]',
      textColor: 'text-[#2F49D1]',
      borderColor: 'border-[#E1E5F2]',
    },
    potential: {
      label: 'Potential Fits',
      description: 'These candidates may need additional training',
      icon: CircleHelp,
      iconBg: 'bg-[#5E75FF]',
      iconText: 'text-white',
      bgColor: 'bg-[#F4F7FE]',
      textColor: 'text-[#2F49D1]',
      borderColor: 'border-[#E1E5F2]',
    },
    notRecommended: {
      label: 'Not Recommended',
      description: 'These candidates do not match the requirements',
      icon: XCircle,
      iconBg: 'bg-[#F95E5E]',
      iconText: 'text-white',
      bgColor: 'bg-red-50',
      textColor: 'text-[#F95E5E]',
      borderColor: 'border-red-200',
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
      <div key={tier} className="rounded-xl border border-[#E1E5F2] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
        <div
          className={`p-4 ${config.bgColor} flex items-center justify-between cursor-pointer rounded-t-xl border-b ${config.borderColor}`}
          onClick={() => toggleTier(tier)}
        >
          <div className="flex items-center">
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full ${config.iconBg}`}
            >
              <Icon className={`h-5 w-5 ${config.iconText}`} />
            </div>
            <div className="ml-3">
              <h3 className={`font-medium ${config.textColor}`}>{config.label}</h3>
              <p className="text-sm text-[#6E7B8A]">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className={`text-sm font-medium ${config.textColor}`}>{count} candidates</span>
            </div>
            <Button variant="ghost" size="icon" className={`h-8 w-8 ${config.textColor} hover:bg-white/20`}>
              {expandedTiers[tier] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>

        {expandedTiers[tier] && (
          <div className="p-4 bg-white rounded-b-xl">
            <div className="grid grid-cols-1 gap-3">
              {candidatesInTier.map((candidate) => (
                <div key={candidate.id} className="p-4 bg-white border border-[#E1E5F2] rounded-lg hover:border-[#5B6CFF] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-[#F4F7FE] flex items-center justify-center text-[#2F49D1] font-medium">
                        {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <Badge className={`${
                          candidate.tier === 'exceptional' ? 'bg-[#44C97F]/10 text-[#44C97F]' :
                          candidate.tier === 'strong' ? 'bg-[#2F49D1]/10 text-[#2F49D1]' :
                          candidate.tier === 'qualified' ? 'bg-[#5B6CFF]/10 text-[#5B6CFF]' :
                          candidate.tier === 'potential' ? 'bg-[#5E75FF]/10 text-[#5E75FF]' :
                          'bg-[#F95E5E]/10 text-[#F95E5E]'
                        }`}>
                          {candidate.matchScore}%
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6E7B8A] mt-1">
                        Clarity: {candidate?.clarity} • Education: {candidate.education}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {candidate.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-[#E1E5F2] text-[#6E7B8A] bg-[#F4F7FE] hover:bg-[#E1E5F2]"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 sm:self-start sm:mt-1">
                      <Button variant="link" size="sm" className="h-auto p-0 text-[#5B6CFF] hover:text-[#2F49D1]">
                        View Resume
                      </Button>
                    </div>
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
    <Card className="border border-[#E1E5F2] bg-white rounded-xl shadow-sm">
      <CardHeader className="pb-4 border-b-0 bg-gradient-to-r from-[#5B6CFF] to-[#7B8CFF] rounded-t-xl shadow-[var(--tw-ring-offset-shadow,0_0_#0000),var(--tw-ring-shadow,0_0_#0000),var(--tw-shadow)]">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Candidates by Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-[#E1E5F2]">
          <span className="text-sm font-medium text-[#2F49D1]">Score Tiers:</span>
          <div className="flex items-center text-xs text-[#44C97F] bg-[#44C97F]/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#44C97F] mr-2"></span>
            90-100% Exceptional
          </div>
          <div className="flex items-center text-xs text-[#2F49D1] bg-[#2F49D1]/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#2F49D1] mr-2"></span>
            80-89% Strong
          </div>
          <div className="flex items-center text-xs text-[#5B6CFF] bg-[#5B6CFF]/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#5B6CFF] mr-2"></span>
            70-79% Qualified
          </div>
          <div className="flex items-center text-xs text-[#5E75FF] bg-[#5E75FF]/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#5E75FF] mr-2"></span>
            60-69% Potential
          </div>
          <div className="flex items-center text-xs text-[#F95E5E] bg-[#F95E5E]/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#F95E5E] mr-2"></span>
            Below 60% Not Recommended
          </div>
        </div>
        {Object.keys(tierConfig).map((tier) => renderTier(tier))}
      </CardContent>
    </Card>
  );
}