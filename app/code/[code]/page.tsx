'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface LinkData {
  id: number;
  code: string;
  long_url: string;
  created_at: string;
  total_clicks: number;
  last_clicked: string | null;
}

export default function StatsPage() {
  const params = useParams();
  const code = params.code as string;
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLink();
  }, [code]);

  const fetchLink = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${code}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to fetch link details');
        }
        return;
      }

      const data = await response.json();
      setLink(data);
      setError('');
    } catch (err) {
      setError('Failed to load link details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysSinceCreation = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading link details...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Link Not Found</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link
            href="/"
            className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${code}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Link Statistics</h1>
            <p className="text-sm sm:text-base text-gray-600">Detailed analytics for your shortened link</p>
          </div>

          {/* Short URL Display */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              Shortened URL
            </label>
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="w-full px-3 py-3 sm:px-4 sm:py-3 bg-white border-2 border-gray-200 rounded-lg font-mono text-xs sm:text-sm leading-relaxed min-h-[44px] flex items-center" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', lineHeight: '1.6' }}>
                {shortUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base shadow-sm"
              >
                {copied ? (
                  <>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 sm:p-6 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Clicks</p>
                  <p className="text-4xl sm:text-5xl font-bold">{link.total_clicks}</p>
                </div>
                <svg
                  className="h-12 w-12 sm:h-14 sm:w-14 text-blue-200 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 sm:p-6 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Days Active</p>
                  <p className="text-4xl sm:text-5xl font-bold">{getDaysSinceCreation(link.created_at)}</p>
                </div>
                <svg
                  className="h-12 w-12 sm:h-14 sm:w-14 text-green-200 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Link Details</h2>
            
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y-2 divide-gray-100">
                <div className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-600 text-xs sm:text-sm mb-1 uppercase tracking-wide">Short Code</div>
                  <div className="font-mono text-gray-900 text-base sm:text-lg font-medium break-all">{link.code}</div>
                </div>

                <div className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-600 text-xs sm:text-sm mb-2 uppercase tracking-wide">Original URL</div>
                  <a
                    href={link.long_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline break-all text-sm sm:text-base leading-relaxed"
                    style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                  >
                    {link.long_url}
                  </a>
                </div>

                <div className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-600 text-xs sm:text-sm mb-1 uppercase tracking-wide">Created At</div>
                  <div className="text-gray-900 text-base sm:text-lg">{formatDate(link.created_at)}</div>
                </div>

                <div className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-600 text-xs sm:text-sm mb-1 uppercase tracking-wide">Last Clicked</div>
                  <div className="text-gray-900 text-base sm:text-lg">{formatDate(link.last_clicked)}</div>
                </div>

                <div className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-600 text-xs sm:text-sm mb-1 uppercase tracking-wide">Total Clicks</div>
                  <div className="text-gray-900 font-bold text-lg sm:text-xl">{link.total_clicks}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Link Button */}
          <div className="mt-6 sm:mt-8">
            <a
              href={`/${link.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-5 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors text-sm sm:text-base font-medium w-full shadow-sm"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>Test Link (Opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
