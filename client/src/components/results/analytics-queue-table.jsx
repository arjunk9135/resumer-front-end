import React from 'react';
import { Button } from '@/components/ui/button';

export default function Table({ data, loading, onRefresh, onCancel }) {
  if (loading) {
    return (
      <div className="py-16 text-center text-gray-400 italic select-none">
        Loading data...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 italic select-none">
        No data found
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg
                 max-w-full"
    >
      <table className="min-w-full divide-y divide-gray-300 bg-white/30 rounded-2xl">
        <thead className="bg-white/40 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            {['Analysis Name', 'Candidates', 'Created', 'Status', 'Progress', 'Actions'].map((head) => (
              <th
                key={head}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((analysis, index) => {
            const progress = analysis.progress || 0;
            return (
              <tr
                key={analysis?.id}
                className={`transition-transform duration-200 ease-in-out cursor-pointer
                           ${index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'}
                           hover:scale-[1.02] hover:bg-white/30`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{analysis?.title}</div>
                  <div className="text-xs text-gray-500">{analysis?.department || analysis?.name}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                  {analysis?.number_of_resumes}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-mono text-sm">
                  {analysis?.creation_time}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                                ${
                                  analysis?.status === 'queued'
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : 'bg-blue-200 text-blue-800'
                                }`}
                  >
                    {analysis?.status === 'queued' ? 'Queued' : 'Processing'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap w-56">
                  <div className="relative h-3 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    {progress}% — {analysis?.estimatedTime || 'Estimating...'}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button
                    variant="link"
                    className="text-red-600 hover:text-red-700 hover:underline"
                    onClick={() => onCancel(analysis?.id)}
                    aria-label={`Cancel analysis ${analysis?.title}`}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 px-6 py-3 border-t border-white/30 bg-white/20 backdrop-blur-sm flex justify-end rounded-b-2xl">
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="text-blue-700 border-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
          aria-label="Refresh table data"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
