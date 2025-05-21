import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function EvaluationCharts({ candidates, loading }) {
  // Prepare average scores across all evaluation categories
  const getCategoryAverages = () => {
    if (!candidates?.length) return [];

    const categories = [
      'clarity_and_structure',
      'relevant_experience',
      'achievements',
      'skills_match',
      'professionalism'
    ];

    return categories.map(category => {
      const total = candidates.reduce((sum, candidate) =>
        sum + candidate.evaluation[category].score, 0);
      const average = total / candidates.length;

      return {
        name: category.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
        value: parseFloat(average.toFixed(1)),
        analysis: candidates[0].evaluation[category].analysis
      };
    });
  };

  // Prepare overall score distribution
  const getScoreDistribution = () => {
    if (!candidates?.length) return [];

    const scoreRanges = [
      { name: 'Poor (0-5)', min: 0, max: 5, count: 0 },
      { name: 'Average (6-7)', min: 6, max: 7, count: 0 },
      { name: 'Good (8-9)', min: 8, max: 9, count: 0 },
      { name: 'Excellent (10)', min: 10, max: 10, count: 0 }
    ];

    candidates.forEach(candidate => {
      const score = candidate?.evaluation?.overall?.score;
      const range = scoreRanges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });

    return scoreRanges;
  };

  // Prepare top performing candidates
  const getTopCandidates = () => {
    if (!candidates?.length) return [];

    return [...candidates]
      .sort((a, b) => b.evaluation.overall.score - a.evaluation.overall.score)
      .slice(0, 3)
      .map(candidate => ({
        name: candidate.name.split('_')[0], // Just first name
        score: candidate.evaluation.overall.score,
        ranking: candidate.evaluation.overall.ranking
      }));
  };

  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const categoryAverages = getCategoryAverages();
  const scoreDistribution = getScoreDistribution();
  const topCandidates = getTopCandidates();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-sm text-sm">
          <p className="font-medium">{payload[0].name || payload[0].payload.name}</p>
          <p>Score: {payload[0].value}{payload[0].payload.max ? `/${payload[0].payload.max}` : ''}</p>
          {payload[0].payload.analysis && (
            <p className="text-xs mt-1 text-gray-600">{payload[0].payload.analysis}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Fixed Category Averages Pie Chart */}
      <Card className="h-80">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium">Evaluation Category Averages</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-[calc(100%-52px)]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : !categoryAverages.length ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>

                <span>No data</span>
              </div>

            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, bottom: 20 }}>
                <Pie
                  data={categoryAverages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {categoryAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="name"
                    position="outside"
                    offset={15}
                    fontSize={10}
                    fill="#333"
                    angle={0}
                    stroke="none"
                  />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card className="h-80">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-[calc(100%-52px)]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : !scoreDistribution.length ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>

                <span>No data</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top Candidates */}
      <Card className="h-80">
        <CardHeader className="px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium">Top Candidates</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-[calc(100%-52px)]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : !topCandidates.length ? (
            <div className="h-full flex items-center justify-center">
             <div className="flex flex-col items-center text-gray-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>

                <span>No data</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCandidates}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
              >
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value) => [`Score: ${value}/10`, '']}
                />
                <Bar dataKey="score" fill="#82CA9D" radius={[0, 4, 4, 0]}>
                  {topCandidates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}