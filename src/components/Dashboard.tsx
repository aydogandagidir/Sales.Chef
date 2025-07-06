import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Dashboard() {
  const stats = useQuery(api.quotes.getDashboardStats);
  const recentQuotes = useQuery(api.quotes.list);
  const seedSampleData = useMutation(api.sampleData.createSampleData);

  if (stats === undefined || recentQuotes === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const conversionRate = stats.total > 0 ? (stats.converted / stats.total * 100).toFixed(1) : '0';
  const recentQuotesList = recentQuotes.slice(0, 5);

  const handleSeedData = async () => {
    try {
      const result = await seedSampleData();
      alert(result);
    } catch (error) {
      alert('Error seeding data: ' + error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          {stats.total === 0 && (
            <button
              onClick={handleSeedData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Load Sample Data
            </button>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.converted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{conversionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Status Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Draft</span>
                <span className="text-sm font-medium text-gray-900">{stats.draft}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sent</span>
                <span className="text-sm font-medium text-gray-900">{stats.sent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved</span>
                <span className="text-sm font-medium text-gray-900">{stats.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Converted</span>
                <span className="text-sm font-medium text-green-600">{stats.converted}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Quotes</h3>
            <div className="space-y-3">
              {recentQuotesList.map((quote) => (
                <div key={quote._id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{quote.quoteNumber}</p>
                    <p className="text-xs text-gray-500">{quote.customer?.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${quote.totalAmount.toLocaleString()}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      quote.status === 'converted' ? 'bg-green-100 text-green-800' :
                      quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      quote.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
