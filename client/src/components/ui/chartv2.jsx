// Chartv2.jsx
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, Title);

export default function Chartv2({ candidates, loading }) {
  if (loading || !candidates || candidates.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[#6E7B8A]">
        Loading chart data...
      </div>
    );
  }

  // Horizontal gradient bar chart (Category Scores)
  const categoryChartData = {
    labels: [
      'Clarity & Structure',
      'Relevant Experience',
      'Achievements',
      'Skills Match',
      'Professionalism',
    ],
    datasets: [
      {
        label: 'Average Score (%)',
        data: candidates.map((c) => c.evaluation.overall.score),
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 250, 0);
          gradient.addColorStop(0, '#6366F1');
          gradient.addColorStop(1, '#A5B4FC');
          return gradient;
        },
        borderRadius: 6, // Less curvy
        barThickness: 26, // Thicker bar
      },
    ],
  };

  // Vertical bar chart (Overall Score per candidate)
const histogramData = {
  labels: candidates.map((c) => c.candidate_name),
  datasets: [
    {
      label: 'Overall Score',
      data: candidates.map((c) => c.evaluation?.overall?.score || 0),
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;
        if (!chartArea) return '#5B6CFF'; // fallback

        const gradient = canvasCtx.createLinearGradient(
          chartArea.left,
          chartArea.bottom,
          chartArea.right,
          chartArea.top
        );

        gradient.addColorStop(0, '#7B8CFF'); // Primary Gradient Start
        gradient.addColorStop(1, '#5B6CFF'); // Primary Gradient End

        return gradient;
      },
      borderRadius: 10,
      barThickness: 40,
    },
  ],
};


  // Donut chart: Experience split
  const donutData = {
  labels: ['0-1 yrs', '1-3 yrs', '3-5 yrs', '5+ yrs'],
  datasets: [
    {
      data: [
        candidates.filter((c) => c.experience <= 1).length,
        candidates.filter((c) => c.experience > 1 && c.experience <= 3).length,
        candidates.filter((c) => c.experience > 3 && c.experience <= 5).length,
        candidates.filter((c) => c.experience > 5).length,
      ],
      backgroundColor: [
        '#B1C0FF', // 0-1 yrs: lightest
        '#5E75FF', // 1-3 yrs: mid-light
        '#3B5BFF', // 3-5 yrs: chart blue
        '#5B6CFF', // 5+ yrs: gradient end
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      cutout: '70%',
    },
  ],
};


  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: '#A1A5B3', font: { size: 10 } },
        grid: { drawBorder: false, color: '#F0F0F0' },
      },
      y: {
        ticks: { color: '#2B265E', font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  const verticalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#A1A5B3', font: { size: 10 } },
        grid: { drawBorder: false, color: '#F0F0F0' },
      },
      x: {
        ticks: { color: '#2B265E', font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#2B265E',
          boxWidth: 10,
          padding: 12,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Horizontal Bar Chart */}
      <Card className="bg-white border border-[#E1E5F2] rounded-3xl shadow hover:shadow-md transition">
        <CardHeader className="px-4 py-3 border-none">
          <CardTitle className="text-sm font-semibold text-[#2B265E]">
            Category Scores Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-4 py-2">
          <Bar data={categoryChartData} options={horizontalBarOptions} />
        </CardContent>
      </Card>

      {/* Vertical Bar Chart */}
      <Card className="bg-white border border-[#E1E5F2] rounded-3xl shadow hover:shadow-md transition">
        <CardHeader className="px-4 py-3 border-none">
          <CardTitle className="text-sm font-semibold text-[#2B265E]">
            Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] px-4 py-2">
          <Bar data={histogramData} options={verticalBarOptions} />
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card className="bg-white border border-[#E1E5F2] rounded-3xl shadow hover:shadow-md transition">
        <CardHeader className="px-4 py-3 border-none">
          <CardTitle className="text-sm font-semibold text-[#2B265E]">
            Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Pie data={donutData} options={donutOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
