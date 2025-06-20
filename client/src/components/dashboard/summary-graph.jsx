// components/dashboard/monthly-savings-chart.jsx
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = {
  labels,
  datasets: [
    {
      label: 'Savings',
      data: [120, 190, 234.2, 180, 150, 200],
      borderColor: '#2E3AFF',
      backgroundColor: 'rgba(46, 58, 255, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#2E3AFF',
      pointRadius: 6,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { display: false },
    x: { grid: { display: false } },
  },
};

export default function SummaryGraph() {
  return (
    <Card className="rounded-[30px] shadow-md bg-[#F5F7FF] p-6">
      <CardContent className="p-0">
        <div className="mb-4 text-gray-500 font-medium text-sm">Saved This Month</div>
        <div className="text-3xl font-bold text-gray-900 mb-4">$234.2</div>
        <div className="flex justify-around text-sm text-gray-400 mb-2">
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
