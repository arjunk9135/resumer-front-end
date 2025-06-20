import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from 'chart.js';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = {
  labels,
  datasets: [
    {
      label: 'Savings',
      data: [120, 190, 234.2, 180, 150, 200],
      borderColor: '#2E3AFF',
      backgroundColor: 'rgba(46, 58, 255, 0.05)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#2E3AFF',
      pointBorderColor: '#fff',
      pointBorderWidth: 3,
      pointRadius: (ctx) => {
        // Highlight dots at Feb (1), Mar (2), and May (4)
        const highlightedPoints = [1, 2, 4];
        return highlightedPoints.includes(ctx.dataIndex) ? 7 : 0;
      },
      pointHoverRadius: 7,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    y: { display: false, grid: { display: false } },
    x: {
      grid: { display: false },
      ticks: {
        font: { size: 12 },
        color: '#A0AEC0',
      },
    },
  },
};

export default function SummaryGraph() {
  return (
    <Card className="rounded-[30px] shadow-md bg-[#F5F7FF] p-6">
      <CardContent className="p-0">
        <div className="mb-4 text-[#A0AEC0] font-medium text-sm">Saved This Month</div>
        <div className="text-3xl font-bold text-black mb-4">$234.2</div>
        <div className="flex justify-around text-sm text-[#A0AEC0] mb-2 font-medium">
          <span>Day</span>
          <span>Week</span>
          <span className="text-black font-semibold border-b-2 border-black">Month</span>
          <span>Year</span>
        </div>
        <div className="h-40">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
