import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function RecentAnalysesTable({ analyses }) {
  if (!analyses || analyses.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-3">No analyses found</p>
        <Link href="/resume-analyzer">
          <Button>Start your first analysis</Button>
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
  switch(status) {
    case 'completed': return 'success';
    case 'processing': return 'default';
    case 'queued': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'outline';
  }
}

function getStatusLabel(status) {
  switch(status) {
    case 'completed': return 'Completed';
    case 'processing': return 'Processing';
    case 'queued': return 'Queued';
    case 'failed': return 'Failed';
    default: return status;
  }
}
