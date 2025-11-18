'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LinkData {
  id: number;
  code: string;
  long_url: string;
  created_at: string;
  total_clicks: number;
  last_clicked: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    longUrl: '',
    customCode: '',
  });
  const [formErrors, setFormErrors] = useState({
    longUrl: '',
    customCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
      setError('');
    } catch (err) {
      setError('Failed to load links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = { longUrl: '', customCode: '' };
    let isValid = true;

    // Validate URL
    if (!formData.longUrl.trim()) {
      errors.longUrl = 'URL is required';
      isValid = false;
    } else {
      try {
        new URL(formData.longUrl);
      } catch {
        errors.longUrl = 'Invalid URL format';
        isValid = false;
      }
    }

    // Validate custom code if provided
    if (formData.customCode && !/^[A-Za-z0-9]{6,8}$/.test(formData.customCode)) {
      errors.customCode = 'Code must be 6-8 alphanumeric characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          longUrl: formData.longUrl,
          customCode: formData.customCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setFormErrors({ ...formErrors, customCode: 'Code already exists' });
        } else {
          setError(data.error || 'Failed to create link');
        }
        return;
      }

      setSuccessMessage('Link created successfully!');
      setFormData({ longUrl: '', customCode: '' });
      setFormErrors({ longUrl: '', customCode: '' });
      await fetchLinks();
    } catch (err) {
      setError('Failed to create link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      await fetchLinks();
    } catch (err) {
      alert('Failed to delete link. Please try again.');
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TinyLink</h1>
          <p className="text-gray-600">Shorten your URLs with ease</p>
        </div>

        {/* Create Link Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Short Link</h2>
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Long URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="longUrl"
                value={formData.longUrl}
                onChange={(e) => setFormData({ ...formData, longUrl: e.target.value })}
                placeholder="https://example.com/very-long-url"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.longUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.longUrl && (
                <p className="mt-1 text-sm text-red-600">{formErrors.longUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Code (optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={formData.customCode}
                onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                placeholder="e.g., abc123 (6-8 characters)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.customCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.customCode && (
                <p className="mt-1 text-sm text-red-600">{formErrors.customCode}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Leave blank for auto-generated code</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Creating...' : 'Shorten URL'}
            </button>
          </form>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Links</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <p className="mt-2 text-gray-600">No links yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Long URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Clicked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/code/${link.code}`}
                            className="text-blue-600 hover:text-blue-800 font-mono font-medium"
                          >
                            {link.code}
                          </Link>
                          <button
                            onClick={() => copyToClipboard(link.code)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy full URL"
                          >
                            {copiedCode === link.code ? (
                              <svg
                                className="h-5 w-5 text-green-500"
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
                            ) : (
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
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={link.long_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                          title={link.long_url}
                        >
                          {truncateUrl(link.long_url)}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {link.total_clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(link.last_clicked)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(link.code)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
