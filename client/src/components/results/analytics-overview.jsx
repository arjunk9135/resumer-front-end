import { Award, BarChart2, Calendar, Wrench } from 'lucide-react';

export default function AnalyticsOverview({ candidates, loading }) {
  // Calculate analytics metrics
  const calculateMetrics = () => {
    if (!candidates || candidates.length === 0) {
      return {
        averageScore: 0,
        top10Score: 0,
        averageExperience: 0,
        skillsCoverage: 0,
        top10Count: 0
      };
    }
    
    // Sort candidates by score
    const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);
    
    // Calculate average score
    const totalScore = candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0);
    const averageScore = totalScore / candidates.length;
    
    // Calculate top 10% score
    const top10Percent = Math.max(1, Math.floor(candidates.length * 0.1));
    const top10Candidates = sortedCandidates.slice(0, top10Percent);
    const top10TotalScore = top10Candidates.reduce((sum, candidate) => sum + candidate.matchScore, 0);
    const top10Score = top10TotalScore / top10Percent;
    
    // Count candidates with score above 90
    const above90Count = candidates.filter(candidate => candidate.matchScore >= 90).length;
    
    // Calculate average experience (assuming experience is a string like "4.5 years")
    // Parse experience values that match pattern: "X.Y years" or "X years"
    const experienceValues = candidates
      .map(candidate => {
        const match = candidate.experience?.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : null;
      })
      .filter(value => value !== null);
    
    const totalExperience = experienceValues.reduce((sum, value) => sum + value, 0);
    const averageExperience = experienceValues.length > 0 ? totalExperience / experienceValues.length : 0;
    
    // Calculate skills coverage (assume skills is an array)
    const skillsCount = candidates.reduce((sum, candidate) => {
      return sum + (Array.isArray(candidate.skills) ? candidate.skills.length : 0);
    }, 0);
    
    const skillsCoverage = candidates.length > 0 ? (skillsCount / candidates.length) / 15 * 100 : 0; // Normalize to percentage
    
    return {
      averageScore: averageScore.toFixed(1),
      top10Score: top10Score.toFixed(1),
      averageExperience: averageExperience.toFixed(1),
      skillsCoverage: skillsCoverage.toFixed(1),
      top10Count: above90Count
    };
  };
  
  const metrics = calculateMetrics();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Match Score */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Average Match Score</h3>
          <div className="p-1 rounded-md bg-primary bg-opacity-10">
            <Award className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-text mt-2">
          {loading ? '...' : `${metrics.averageScore}%`}
        </p>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-secondary font-medium">↑ 4.2%</span>
          <span className="text-gray-500 ml-1">higher than average</span>
        </div>
      </div>
      
      {/* Top 10% Score */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Top 10% Score</h3>
          <div className="p-1 rounded-md bg-secondary bg-opacity-10">
            <BarChart2 className="h-5 w-5 text-secondary" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-text mt-2">
          {loading ? '...' : `${metrics.top10Score}%`}
        </p>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-gray-500">
            {loading ? '...' : `${metrics.top10Count} candidates scored above 90%`}
          </span>
        </div>
      </div>
      
      {/* Experience Level */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Experience Level</h3>
          <div className="p-1 rounded-md bg-primary bg-opacity-10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-text mt-2">
          {loading ? '...' : `${metrics.averageExperience} yrs`}
        </p>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-secondary font-medium">+0.9 yrs</span>
          <span className="text-gray-500 ml-1">above requirement</span>
        </div>
      </div>
      
      {/* Skills Coverage */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Skills Coverage</h3>
          <div className="p-1 rounded-md bg-secondary bg-opacity-10">
            <Wrench className="h-5 w-5 text-secondary" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-text mt-2">
          {loading ? '...' : `${metrics.skillsCoverage}%`}
        </p>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-gray-500">
            {loading ? '...' : 'Key skills matched on average'}
          </span>
        </div>
      </div>
    </div>
  );
}
