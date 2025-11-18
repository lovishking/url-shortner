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
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Shortened URL
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg font-mono text-xs sm:text-sm" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                {shortUrl}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
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
                    <span className="text-sm sm:text-base">Copied!</span>
                  </>
                ) : (
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl sm:text-4xl font-bold mt-1 sm:mt-2">{link.total_clicks}</p>
                </div>
                <svg
                  className="h-10 w-10 sm:h-12 sm:w-12 text-blue-200"
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

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs sm:text-sm font-medium">Days Active</p>
                  <p className="text-3xl sm:text-4xl font-bold mt-1 sm:mt-2">{getDaysSinceCreation(link.created_at)}</p>
                </div>
                <svg
                  className="h-10 w-10 sm:h-12 sm:w-12 text-green-200"
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Link Details</h2>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="font-medium text-gray-700 text-sm sm:text-base">Short Code</div>
                  <div className="sm:col-span-2 font-mono text-gray-900 text-sm sm:text-base break-all">{link.code}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="font-medium text-gray-700 text-sm sm:text-base">Original URL</div>
                  <div className="sm:col-span-2">
                    <a
                      href={link.long_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all text-sm sm:text-base"
                    >
                      {link.long_url}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="font-medium text-gray-700 text-sm sm:text-base">Created At</div>
                  <div className="sm:col-span-2 text-gray-900 text-sm sm:text-base">{formatDate(link.created_at)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="font-medium text-gray-700 text-sm sm:text-base">Last Clicked</div>
                  <div className="sm:col-span-2 text-gray-900 text-sm sm:text-base">{formatDate(link.last_clicked)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="font-medium text-gray-700 text-sm sm:text-base">Total Clicks</div>
                  <div className="sm:col-span-2 text-gray-900 font-semibold text-sm sm:text-base">{link.total_clicks}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Link Button */}
          <div className="mt-6 sm:mt-8 text-center">
            <a
              href={`/${link.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto"
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
