import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Charts({ candidates, loading }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Function to prepare score distribution data
  const getScoreDistributionData = () => {
    if (!candidates || candidates.length === 0) return [];
    
    // Create score ranges
    const ranges = [
      { name: '0-50', range: [0, 50], count: 0 },
      { name: '51-60', range: [51, 60], count: 0 },
      { name: '61-70', range: [61, 70], count: 0 },
      { name: '71-80', range: [71, 80], count: 0 },
      { name: '81-90', range: [81, 90], count: 0 },
      { name: '91-100', range: [91, 100], count: 0 },
    ];
    
    // Count candidates in each range
    candidates.forEach(candidate => {
      const score = candidate.matchScore;
      const range = ranges.find(r => score >= r.range[0] && score <= r.range[1]);
      if (range) range.count++;
    });
    
    return ranges;
  };
  
  // Function to prepare skills gap data
  const getSkillsGapData = () => {
    if (!candidates || candidates.length === 0) return [];
    
    // Count skills across all candidates
    const skillsCount = {};
    
    candidates.forEach(candidate => {
      if (!Array.isArray(candidate.skills)) return;
      
      candidate.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    const skillsData = Object.entries(skillsCount)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / candidates.length) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // Take top 5 skills
    
    return skillsData;
  };
  
  // Function to prepare experience distribution data
  const getExperienceData = () => {
    if (!candidates || candidates.length === 0) return [];
    
    // Create experience ranges
    const ranges = [
      { name: '0-1 years', range: [0, 1], count: 0, color: '#B7DAF5' },
      { name: '1-3 years', range: [1, 3], count: 0, color: '#93C1E5' },
      { name: '3-5 years', range: [3, 5], count: 0, color: '#6FA4D3' },
      { name: '5-7 years', range: [5, 7], count: 0, color: '#4A7DBD' },
      { name: '7+ years', range: [7, 100], count: 0, color: '#2557A7' },
    ];
    
    // Count candidates in each range
    candidates.forEach(candidate => {
      const expMatch = candidate.experience?.match(/(\d+\.?\d*)/);
      if (!expMatch) return;
      
      const yearsExp = parseFloat(expMatch[1]);
      const range = ranges.find(r => yearsExp >= r.range[0] && yearsExp < r.range[1]);
      if (range) range.count++;
    });
    
    return ranges;
  };
  
  // Prepare chart data
  const scoreDistributionData = getScoreDistributionData();
  const skillsGapData = getSkillsGapData();
  const experienceData = getExperienceData();
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="text-xs font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Colors for the charts
  const COLORS = ['#2557A7', '#4A7DBD', '#6FA4D3', '#93C1E5', '#B7DAF5'];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Score Distribution Chart */}
      <Card>
        <CardHeader className="px-6 py-5 border-b border-gray-100">
          <CardTitle className="font-display font-semibold text-lg text-text">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-64">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreDistributionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#2557A7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Skills Gap Analysis */}
      <Card>
        <CardHeader className="px-6 py-5 border-b border-gray-100">
          <CardTitle className="font-display font-semibold text-lg text-text">Skills Coverage</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-64">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : candidates.length === 0 || skillsGapData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">No skills data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillsGapData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" fill="#2557A7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Experience Distribution */}
      <Card>
        <CardHeader className="px-6 py-5 border-b border-gray-100">
          <CardTitle className="font-display font-semibold text-lg text-text">Experience Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-64">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">No experience data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={experienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={windowWidth < 768 ? 40 : 50}
                  outerRadius={windowWidth < 768 ? 60 : 70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="count"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {experienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
