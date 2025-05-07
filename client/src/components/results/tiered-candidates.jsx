import { useState } from 'react';
import { 
  Star, 
  Trophy, 
  CheckCircle2, 
  CircleHelp, 
  XCircle,
  ChevronDown, 
  ChevronUp,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function TieredCandidates({ candidates }) {
  const [expandedTiers, setExpandedTiers] = useState({
    exceptional: true,
    strong: true,
    qualified: false,
    potential: false,
    notRecommended: false,
  });
  
  // Group candidates by tier
  const candidatesByTier = candidates.reduce((acc, candidate) => {
    const tier = candidate.tier || 'potential';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(candidate);
    return acc;
  }, {});
  
  // Get the count and percentage for each tier
  const tierCounts = {
    exceptional: (candidatesByTier.exceptional || []).length,
    strong: (candidatesByTier.strong || []).length,
    qualified: (candidatesByTier.qualified || []).length,
    potential: (candidatesByTier.potential || []).length,
    notRecommended: (candidatesByTier.notRecommended || []).length,
  };
  
  const totalCandidates = candidates.length;
  
  const tierPercentages = Object.keys(tierCounts).reduce((acc, tier) => {
    acc[tier] = totalCandidates > 0 
      ? Math.round((tierCounts[tier] / totalCandidates) * 100) 
      : 0;
    return acc;
  }, {});
  
  // Toggle tier expansion
  const toggleTier = (tier) => {
    setExpandedTiers({
      ...expandedTiers,
      [tier]: !expandedTiers[tier],
    });
  };
  
  // Tier configurations
  const tierConfig = {
    exceptional: {
      label: 'Exceptional Matches',
      description: 'These candidates closely match the job requirements',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100',
      textColor: 'text-yellow-700',
    },
    strong: {
      label: 'Strong Matches',
      description: 'These candidates match most of the job requirements',
      icon: Trophy,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      textColor: 'text-blue-700',
    },
    qualified: {
      label: 'Qualified Candidates',
      description: 'These candidates meet the minimum requirements',
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      textColor: 'text-green-700',
    },
    potential: {
      label: 'Potential Fits',
      description: 'These candidates may need additional training',
      icon: CircleHelp,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-100',
      textColor: 'text-gray-700',
    },
    notRecommended: {
      label: 'Not Recommended',
      description: 'These candidates do not match the requirements',
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      textColor: 'text-red-700',
    },
  };
  
  // Function to render a tier section
  const renderTier = (tier) => {
    const config = tierConfig[tier];
    const candidatesInTier = candidatesByTier[tier] || [];
    const count = candidatesInTier.length;
    
    if (count === 0) return null;
    
    const Icon = config.icon;
    
    return (
      <div key={tier} className={`rounded-lg overflow-hidden mb-4 ${config.borderColor} border`}>
        <div 
          className={`p-4 ${config.bgColor} flex items-center justify-between cursor-pointer`}
          onClick={() => toggleTier(tier)}
        >
          <div className="flex items-center">
            <Icon className={`h-5 w-5 ${config.color} mr-2`} />
            <div>
              <h3 className="font-medium">{config.label}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-sm font-medium">{count} candidates</span>
              <div className="text-xs text-gray-500">{tierPercentages[tier]}% of total</div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {expandedTiers[tier] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
        
        {expandedTiers[tier] && (
          <div className="p-3 bg-white">
            <div className="grid grid-cols-1 gap-3">
              {candidatesInTier.map((candidate) => (
                <div key={candidate.id} className="p-3 bg-gray-50 rounded flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h4 className="font-medium text-sm">{candidate.name}</h4>
                      <Badge className="ml-2">{candidate.matchScore}%</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {candidate.experience} • {candidate.education} • {candidate.location}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(Array.isArray(candidate.skills) ? candidate.skills : candidate.skills?.split(',') || [])
                        .slice(0, 3)
                        .map((skill, i) => (
                          <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      {(Array.isArray(candidate.skills) ? candidate.skills.length : (candidate.skills?.split(',') || []).length) > 3 && (
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          +{(Array.isArray(candidate.skills) ? candidate.skills.length : (candidate.skills?.split(',') || []).length) - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex sm:flex-col items-center sm:items-end">
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                      View Resume
                    </Button>
                  </div>
                </div>
              ))}
              
              {candidatesInTier.length > 5 && (
                <Button variant="outline" className="mt-2">
                  View All {candidatesInTier.length} Candidates
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          Candidates by Tier
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b">
          <span className="text-sm font-medium">Score Tiers:</span>
          <div className="flex items-center text-xs text-yellow-700">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
            90-100% Exceptional
          </div>
          <div className="flex items-center text-xs text-blue-700">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            80-89% Strong
          </div>
          <div className="flex items-center text-xs text-green-700">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            70-79% Qualified
          </div>
          <div className="flex items-center text-xs text-gray-700">
            <span className="w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
            60-69% Potential
          </div>
          <div className="flex items-center text-xs text-red-700">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            Below 60% Not Recommended
          </div>
        </div>
        
        {/* Tier Sections */}
        <div className="space-y-4">
          {candidates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No candidates found</div>
          ) : (
            <>
              {renderTier('exceptional')}
              {renderTier('strong')}
              {renderTier('qualified')}
              {renderTier('potential')}
              {renderTier('notRecommended')}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}