// components/loader-overlay.jsx
import { Loader2 } from 'lucide-react';

export default function LoaderOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm">Processing your request...</p>
      </div>
    </div>
  );
}