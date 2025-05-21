import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { PlusIcon } from 'lucide-react';

export default function RecentAnalysesTable({ analyses }) {
  if (!analyses || analyses.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="mb-6 text-base font-medium select-none">No analyses in progress</p>
        <Link href="/resume-analyzer" passHref>
          <a>
            <button
              style={{
                backgroundColor:'#d7e0f66e',
                boxShadow:
                  "0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              }}
              className="inline-flex items-center px-5 py-3 bg-white/30 hover:shadow-lg transition-shadow duration-300 hover:bg-white/50 text-gray-800 font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Start New Analysis
            </button>

          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {analyses.map(analysis => (
            <tr key={analysis.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-text">{analysis.jobTitle}</div>
                {analysis.department && (
                  <div className="text-xs text-gray-500">{analysis.department}</div>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{analysis.candidateCount}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {analysis.createdAt ? (
                    formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })
                  ) : 'Unknown date'}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <Badge variant={getStatusVariant(analysis.status)}>
                  {getStatusLabel(analysis.status)}
                </Badge>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <Link href={`/results/${analysis.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper functions
function getStatusVariant(status) {
  switch (status) {
    case 'completed': return 'success';
    case 'processing': return 'default';
    case 'queued': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'outline';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'completed': return 'Completed';
    case 'processing': return 'Processing';
    case 'queued': return 'Queued';
    case 'failed': return 'Failed';
    default: return status;
  }
}
