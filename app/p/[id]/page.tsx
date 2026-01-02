'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ViewPaste() {
  const params = useParams();
  const id = params.id as string;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [remainingViews, setRemainingViews] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const res = await fetch(`/api/pastes/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Paste not found');
          setLoading(false);
          return;
        }

        setContent(data.content);
        setRemainingViews(data.remaining_views);
        setExpiresAt(data.expires_at);
        setLoading(false);
      } catch  {
        setError('Failed to load paste');
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Paste Content</h1>
            <a 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create New
            </a>
          </div>

          {(remainingViews !== null || expiresAt) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
              {remainingViews !== null && (
                <div>Remaining views: {remainingViews}</div>
              )}
              {expiresAt && (
                <div>Expires at: {new Date(expiresAt).toLocaleString()}</div>
              )}
            </div>
          )}

          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words text-gray-900 font-mono text-sm">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}