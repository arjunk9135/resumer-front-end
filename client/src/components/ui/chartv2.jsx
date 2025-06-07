import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title);

export default function Chartv2({ candidates, loading }) {
  if (loading || !candidates || candidates.length === 0) {
    return <div className="text-center py-8">Loading chart data...</div>;
  }

  // Process candidates data for charts
  const categoryChartData = {
    labels: ['Clarity & Structure', 'Relevant Experience', 'Achievements', 'Skills Match', 'Professionalism'],
    datasets: [{
      label: 'Average Score (%)',
      data: candidates.map(candidate => candidate.evaluation.overall.score),
      backgroundColor: 'rgba(99, 102, 241, 0.8)', // Subtle Indigo
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1
    }]
  };

  const histogramData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [{
      label: 'Overall Score',
      data: candidates.map(candidate => candidate.evaluation.overall.score),
      backgroundColor: 'rgba(16, 185, 129, 0.8)', // Subtle Emerald
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1
    }]
  };

  const donutData = {
    labels: ['0-1 yrs', '1-3 yrs', '3-5 yrs', '5+ yrs'],
    datasets: [{
      data: [
        candidates.filter(candidate => candidate.experience <= 1).length,
        candidates.filter(candidate => candidate.experience > 1 && candidate.experience <= 3).length,
        candidates.filter(candidate => candidate.experience > 3 && candidate.experience <= 5).length,
        candidates.filter(candidate => candidate.experience > 5).length
      ],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)', // Indigo
        'rgba(16, 185, 129, 0.8)', // Emerald
        'rgba(234, 179, 8, 0.8)',  // Amber
        'rgba(239, 68, 68, 0.8)'   // Red
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Horizontal Bar Chart */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800">Category Scores Analysis</CardTitle>
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
                  text: 'Average Scores by Category',
                  color: '#374151', // Gray text for better contrast
                  font: {
                    size: 16
                  }
                },
                legend: {
                  display: false
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: '#374151' // Gray ticks
                  }
                },
                y: {
                  ticks: {
                    color: '#374151' // Gray ticks
                  }
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Histogram */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800">Score Distribution</CardTitle>
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
                  text: 'Candidate Match Score Distribution',
                  color: '#374151', // Gray text for better contrast
                  font: {
                    size: 16
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Overall Score',
                    color: '#374151' // Gray text
                  },
                  ticks: {
                    color: '#374151' // Gray ticks
                  }
                },
                x: {
                  ticks: {
                    color: '#374151' // Gray ticks
                  }
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800">Experience Level Distribution</CardTitle>
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
                  text: 'Candidate Experience Breakdown',
                  color: '#374151', // Gray text for better contrast
                  font: {
                    size: 16
                  }
                },
                legend: {
                  position: 'right',
                  labels: {
                    color: '#374151' // Gray text for legend
                  }
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