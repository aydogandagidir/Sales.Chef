import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ReportCharts } from "./ReportCharts";

export function Reports() {
  const [activeTab, setActiveTab] = useState<'executive' | 'sales' | 'customers' | 'products' | 'pipeline' | 'industry' | 'trends'>('executive');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const executiveSummary = useQuery(api.reports.getExecutiveSummary);
  const salesPerformance = useQuery(api.reports.getSalesPerformance, {
    startDate: new Date(dateRange.startDate).getTime(),
    endDate: new Date(dateRange.endDate).getTime(),
    period,
  });
  const customerAnalysis = useQuery(api.reports.getCustomerAnalysis);
  const productPerformance = useQuery(api.reports.getProductPerformance);
  const quotePipeline = useQuery(api.reports.getQuotePipeline);
  const industryAnalysis = useQuery(api.reports.getIndustryAnalysis);
  const monthlyTrends = useQuery(api.reports.getMonthlyTrends, { months: 12 });

  const tabs = [
    { id: 'executive', name: 'Executive Summary', icon: '📊' },
    { id: 'sales', name: 'Sales Performance', icon: '📈' },
    { id: 'customers', name: 'Customer Analysis', icon: '👥' },
    { id: 'products', name: 'Product Performance', icon: '📦' },
    { id: 'pipeline', name: 'Quote Pipeline', icon: '🔄' },
    { id: 'industry', name: 'Industry Analysis', icon: '🏭' },
    { id: 'trends', name: 'Monthly Trends', icon: '📅' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (executiveSummary === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Export PDF
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Excel
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Date Range Filter */}
        {(activeTab === 'sales' || activeTab === 'trends') && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex space-x-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              {activeTab === 'sales' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group By
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="quarter">Quarter</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Executive Summary */}
          {activeTab === 'executive' && executiveSummary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                      <p className="text-2xl font-semibold text-gray-900">{executiveSummary.overview.totalQuotes}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatCurrency(executiveSummary.overview.totalValue)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatPercent(executiveSummary.overview.conversionRate)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Quote Value</p>
                      <p className="text-2xl font-semibold text-gray-900">{formatCurrency(executiveSummary.overview.avgQuoteValue)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Performance (30 Days)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Quotes:</span>
                      <span className="font-medium">{executiveSummary.recent.quotesLast30Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quote Value:</span>
                      <span className="font-medium">{formatCurrency(executiveSummary.recent.valueLast30Days)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conversions:</span>
                      <span className="font-medium text-green-600">{executiveSummary.recent.convertedLast30Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Converted Value:</span>
                      <span className="font-medium text-green-600">{formatCurrency(executiveSummary.recent.convertedValueLast30Days)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h3>
                  <div className="space-y-3">
                    {executiveSummary.topCustomers.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{item.customer?.companyName}</p>
                          <p className="text-sm text-gray-500">{item.customer?.contactName}</p>
                        </div>
                        <span className="font-medium text-green-600">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sales Performance */}
          {activeTab === 'sales' && salesPerformance && (
            <div className="space-y-6">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Sales Performance by {period}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Quote Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesPerformance.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.totalValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{row.convertedQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(row.convertedValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(row.conversionRate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.avgQuoteValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Customer Analysis */}
          {activeTab === 'customers' && customerAnalysis && (
            <div className="space-y-6">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Customer Performance Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quotes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Quote Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerAnalysis.slice(0, 20).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{row.customer.companyName}</div>
                              <div className="text-sm text-gray-500">{row.customer.contactName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customer.industry || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.totalValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{row.convertedQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(row.conversionRate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.avgQuoteValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Product Performance */}
          {activeTab === 'products' && productPerformance && (
            <div className="space-y-6">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Product Performance Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Times Quoted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productPerformance.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{row.product.name}</div>
                              <div className="text-sm text-gray-500">{row.product.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.timesQuoted}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalQuantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.totalValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{row.convertedQuantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(row.conversionRate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.avgPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Quote Pipeline */}
          {activeTab === 'pipeline' && quotePipeline && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(quotePipeline).map(([status, data]) => (
                  <div key={status} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {status.replace('_', ' ')}
                      </h4>
                      <span className="text-lg font-semibold text-gray-900">{data.count}</span>
                    </div>
                    <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((data.count / Math.max(...Object.values(quotePipeline).map(d => d.count))) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Pipeline Details</h3>
                </div>
                <div className="p-6">
                  {Object.entries(quotePipeline).map(([status, data]) => (
                    <div key={status} className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3 capitalize">
                        {status.replace('_', ' ')} ({data.count} quotes - {formatCurrency(data.value)})
                      </h4>
                      <div className="space-y-2">
                        {data.quotes.slice(0, 5).map((quote) => (
                          <div key={quote._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{quote.quoteNumber}</span>
                              <span className="text-gray-600 ml-2">{quote.customer?.companyName}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(quote.totalAmount)}</span>
                          </div>
                        ))}
                        {data.quotes.length > 5 && (
                          <p className="text-sm text-gray-500 text-center">
                            ... and {data.quotes.length - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Industry Analysis */}
          {activeTab === 'industry' && industryAnalysis && (
            <div className="space-y-6">
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Performance by Industry</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quotes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Quote Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {industryAnalysis.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.industry}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.customerCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.totalValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{row.convertedQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(row.conversionRate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.avgQuoteValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Trends */}
          {activeTab === 'trends' && monthlyTrends && (
            <div className="space-y-6">
              {/* Visual Charts */}
              <ReportCharts 
                monthlyTrends={monthlyTrends} 
                quotePipeline={quotePipeline} 
                industryAnalysis={industryAnalysis}
              />
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">12-Month Trends Data</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Converted Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Quote Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyTrends.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.monthName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.totalValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{row.convertedQuotes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(row.convertedValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercent(row.conversionRate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(row.avgQuoteValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visual Trend Chart Placeholder */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trend Visualization</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">📈 Chart Visualization</p>
                    <p className="text-sm text-gray-400">
                      Interactive charts would be displayed here<br/>
                      (Chart.js or similar library integration)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
