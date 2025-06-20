import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title);

export default function Chartv2({ candidates, loading }) {
  if (loading || !candidates || candidates.length === 0) {
    return <div className="text-center py-8 text-sm text-[#6E7B8A]">Loading chart data...</div>;
  }

  const categoryChartData = {
    labels: ['Clarity & Structure', 'Relevant Experience', 'Achievements', 'Skills Match', 'Professionalism'],
    datasets: [{
      label: 'Average Score (%)',
      data: candidates.map(candidate => candidate.evaluation.overall.score),
      backgroundColor: 'rgba(91,108,255,0.85)',
      borderRadius: 8,
      barThickness: 18,
    }]
  };

  const histogramData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [{
      label: 'Overall Score',
      data: candidates.map(candidate => candidate.evaluation.overall.score),
      backgroundColor: 'rgba(91,108,255,0.75)',
      borderRadius: 6,
      barThickness: 16,
    }]
  };

  const donutData = {
    labels: ['0-1 yrs', '1-3 yrs', '3-5 yrs', '5+ yrs'],
    datasets: [{
      data: [
        candidates.filter(c => c.experience <= 1).length,
        candidates.filter(c => c.experience > 1 && c.experience <= 3).length,
        candidates.filter(c => c.experience > 3 && c.experience <= 5).length,
        candidates.filter(c => c.experience > 5).length
      ],
      backgroundColor: [
        '#3B5BFF',
        '#5E75FF',
        '#7B8CFF',
        '#B1C0FF'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      cutout: '70%',
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Horizontal Bar Chart */}
      <Card className="bg-white border border-[#E1E5F2] rounded-3xl shadow hover:shadow-md transition">
        <CardHeader className="px-4 py-3 border-none border-[#E1E5F2]  rounded-t-xl">
          <CardTitle className="text-sm font-semibold text-[#2B265E]">Category Scores Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-4 py-2">
          <Bar
            data={categoryChartData}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: { color: '#A1A5B3', font: { size: 10 } },
                  grid: { drawBorder: false, color: '#F0F0F0' }
                },
                y: {
                  ticks: { color: '#2B265E', font: { size: 11 } },
                  grid: { display: false }
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Vertical Bar Chart */}
      <Card className="bg-white border border-[#E1E5F2] rounded-3xl shadow hover:shadow-md transition">
        <CardHeader className="px-4 py-3 border-none border-[#E1E5F2]  rounded-t-xl">
          <CardTitle className="text-sm font-semibold text-[#2B265E]">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-4 py-2">
          <Bar
            data={histogramData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: '#A1A5B3', font: { size: 10 } },
                  grid: { drawBorder: false, color: '#F0F0F0' }
                },
                x: {
                  ticks: { color: '#2B265E', font: { size: 11 } },
                  grid: { display: false }
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card className="bg-white border border-[#E1E5F2] rounded-3xl shadow hover:shadow-md transition">
        <CardHeader className="px-4 py-3 border-none border-[#E1E5F2]  rounded-t-xl">
          <CardTitle className="text-sm font-semibold text-[#2B265E]">Experience Level</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Pie
            data={donutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: '#2B265E',
                    boxWidth: 10,
                    padding: 12,
                    font: { size: 11 }
                  }
                },
              },
              cutout: '70%'
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
