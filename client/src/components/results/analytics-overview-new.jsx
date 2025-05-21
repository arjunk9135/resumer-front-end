import { Award, BarChart2, Calendar, Wrench } from 'lucide-react';

export default function AnalyticsOverview({ candidates, loading }) {
  // Calculate analytics metrics
  const calculateMetrics = () => {
    if (!candidates || candidates.length === 0) {
      return {
        averageScore: 0,
        top10Percent: 0,
        averageExperience: 0,
        skillsCoverage: 0,
        top10Count: 0,
        experienceLevel: 'Junior'
      };
    }
    
    // Calculate match scores using evaluation data already present
    const candidatesWithMatchScores = candidates.map(candidate => {
      // Use the skills_match score if available in evaluation
      let matchScore = 0;
      
      if (candidate.evaluation && candidate.evaluation.skills_match) {
        // Convert skills_match score (likely on a scale of 1-10) to percentage
        matchScore = (candidate.evaluation.skills_match.score / 10) * 100;
      } else if (candidate.evaluation && candidate.evaluation.overall) {
        // Use overall score as fallback
        matchScore = (candidate.evaluation.overall.score / 10) * 100;
      }
      
      return {
        ...candidate,
        matchScore: matchScore
      };
    });
    
    // Calculate average match score
    const totalScore = candidatesWithMatchScores.reduce((sum, candidate) => sum + candidate.matchScore, 0);
    const averageScore = totalScore / candidates.length;
    
    // Count candidates with score above or equal to 90
    const above90Count = candidatesWithMatchScores.filter(candidate => candidate.matchScore >= 90).length;
    
    // Calculate top 10% score
    const top10Percent = above90Count > 0 ? (above90Count / candidates.length) * 100 : 0;
    
    // Calculate average experience
    const calculateExperience = (candidate) => {
      // If experience is already a number, use it directly
      if (typeof candidate.experience === 'number') {
        return candidate.experience;
      }
      
      // Otherwise try to extract it from text
      if (typeof candidate.experience === 'string') {
        const match = candidate.experience.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      }
      
      return 0;
    };
    
    const experienceValues = candidates.map(calculateExperience);
    const totalExperience = experienceValues.reduce((sum, value) => sum + value, 0);
    const averageExperience = totalExperience / candidates.length;
    
    // Determine experience level
    let experienceLevel = 'Junior';
    if (averageExperience >= 5) experienceLevel = 'Senior';
    else if (averageExperience >= 2) experienceLevel = 'Mid-level';
    
    // Calculate skills coverage
    // Instead of comparing to a job description, calculate the average number of skills
    // as a percentage of a "complete" skill set (assuming 20 skills would be 100%)
    const maxExpectedSkills = 20; // This can be adjusted based on your domain
    const skillsCounts = candidates.map(candidate => {
      const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
      return Math.min(100, (candidateSkills.length / maxExpectedSkills) * 100);
    });
    
    const averageSkillsCoverage = skillsCounts.reduce((sum, count) => sum + count, 0) / candidates.length;
    
    return {
      averageScore: averageScore.toFixed(0),
      top10Percent: top10Percent.toFixed(0),
      averageExperience: averageExperience.toFixed(1),
      skillsCoverage: averageSkillsCoverage.toFixed(0),
      top10Count: above90Count,
      experienceLevel
    };
  };
  
  const metrics = calculateMetrics();

  // Progress bar component
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Match Score */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Average Match Score</h3>
          <div className="p-1 rounded-md bg-blue-100">
            <Award className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-gray-900 mt-2">
          {loading ? '...' : `${metrics.averageScore}%`}
        </p>
        <ProgressBar value={metrics.averageScore} />
        <p className="mt-2 text-xs text-gray-500">
          Based on evaluation scores
        </p>
      </div>
      
      {/* Top 10% Score */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Top Candidates Ratio</h3>
          <div className="p-1 rounded-md bg-blue-100">
            <BarChart2 className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-gray-900 mt-2">
          {loading ? '...' : `${metrics.top10Percent}%`}
        </p>
        <ProgressBar value={metrics.top10Percent} />
        <p className="mt-2 text-xs text-gray-500">
          {loading ? '...' : `${metrics.top10Count} candidates scored above 90%`}
        </p>
      </div>
      
      {/* Experience Level */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Experience Level</h3>
          <div className="p-1 rounded-md bg-blue-100">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-gray-900 mt-2">
          {loading ? '...' : `${metrics.averageExperience} yrs`}
        </p>
        <ProgressBar value={Math.min(100, metrics.averageExperience * 15)} />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">Junior</span>
          <span className="text-xs text-gray-500">Mid-level</span>
          <span className="text-xs text-gray-500">Senior</span>
        </div>
      </div>
      
      {/* Skills Coverage */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Skills Coverage</h3>
          <div className="p-1 rounded-md bg-blue-100">
            <Wrench className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-semibold text-gray-900 mt-2">
          {loading ? '...' : `${metrics.skillsCoverage}%`}
        </p>
        <ProgressBar value={metrics.skillsCoverage} />
        <p className="mt-2 text-xs text-gray-500">
          {loading ? '...' : 'Average skills per candidate'}
        </p>
      </div>
    </div>
  );
}