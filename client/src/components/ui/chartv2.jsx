// components/results/charts.jsx
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Chartv2({ candidates, loading }) {
  if (loading || !candidates || candidates.length === 0) {
    return <div className="text-center py-8">Loading chart data...</div>;
  }

  // 1. Horizontal Bar Chart - Category Scores
  const categoryScores = calculateCategoryScores(candidates);
  const categoryChartData = {
    labels: ['Education', 'Experience', 'Skills', 'Languages', 'Soft Skills'],
    datasets: [{
      label: 'Average Score (%)',
      data: [
        categoryScores.education,
        categoryScores.experience,
        categoryScores.skills,
        categoryScores.languages,
        categoryScores.softSkills
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  // 2. Histogram - Score Distribution
  const scoreDistribution = calculateScoreDistribution(candidates);
  const histogramData = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [{
      label: 'Number of Candidates',
      data: [
        scoreDistribution['0-20'],
        scoreDistribution['21-40'],
        scoreDistribution['41-60'],
        scoreDistribution['61-80'],
        scoreDistribution['81-100']
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // 3. Donut Chart - Experience Breakdown
  const experienceData = calculateExperienceBreakdown(candidates);
  const donutData = {
    labels: ['0-1 yrs', '1-3 yrs', '3-5 yrs', '5+ yrs'],
    datasets: [{
      data: [
        experienceData['0-1'],
        experienceData['1-3'],
        experienceData['3-5'],
        experienceData['5+']
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Horizontal Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Category Scores Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Bar 
            data={categoryChartData}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Average Scores by Category'
                },
                legend: {
                  display: false
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Histogram */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Bar 
            data={histogramData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Candidate Match Score Distribution'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Candidates'
                  }
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Level Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Pie 
            data={donutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Candidate Experience Breakdown'
                },
                legend: {
                  position: 'right'
                }
              },
              cutout: '70%'
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions remain the same...
// Helper functions
function calculateCategoryScores(candidates) {
  const totals = {
    education: 0,
    experience: 0,
    skills: 0,
    languages: 0,
    softSkills: 0
  };

  candidates.forEach(candidate => {
    totals.education += candidate.evaluation?.education_relevance?.score || 0;
    totals.experience += candidate.evaluation?.relevant_experience?.score || 0;
    totals.skills += candidate.evaluation?.skills_match?.score || 0;
    totals.languages += candidate.evaluation?.language_proficiency?.score || 0;
    totals.softSkills += candidate.evaluation?.soft_skills?.score || 0;
  });

  return {
    education: Math.round((totals.education / candidates.length) * 10),
    experience: Math.round((totals.experience / candidates.length) * 10),
    skills: Math.round((totals.skills / candidates.length) * 10),
    languages: Math.round((totals.languages / candidates.length) * 10),
    softSkills: Math.round((totals.softSkills / candidates.length) * 10)
  };
}

function calculateScoreDistribution(candidates) {
  const distribution = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0
  };

  candidates.forEach(candidate => {
    const score = candidate.evaluation?.overall?.score * 10 || 0; // Convert to percentage
    if (score <= 20) distribution['0-20']++;
    else if (score <= 40) distribution['21-40']++;
    else if (score <= 60) distribution['41-60']++;
    else if (score <= 80) distribution['61-80']++;
    else distribution['81-100']++;
  });

  return distribution;
}

function calculateSkillsCoverage(candidates) {
  const skillCounts = {};
  const totalCandidates = candidates.length;

  candidates.forEach(candidate => {
    if (Array.isArray(candidate.skills)) {
      candidate.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    }
  });

  // Convert counts to percentages
  const skillsCoverage = {};
  Object.keys(skillCounts).forEach(skill => {
    skillsCoverage[skill] = Math.round((skillCounts[skill] / totalCandidates) * 100);
  });

  // Sort by most common skills
  return Object.fromEntries(
    Object.entries(skillsCoverage).sort((a, b) => b[1] - a[1])
  );
}

function calculateExperienceBreakdown(candidates) {
  const experience = {
    '0-1': 0,
    '1-3': 0,
    '3-5': 0,
    '5+': 0
  };

  candidates.forEach(candidate => {
    const exp = candidate.experience || 0;
    if (exp <= 1) experience['0-1']++;
    else if (exp <= 3) experience['1-3']++;
    else if (exp <= 5) experience['3-5']++;
    else experience['5+']++;
  });

  return experience;
}