import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MonthlyTrend {
  month: string;
  monthName: string;
  totalQuotes: number;
  totalValue: number;
  convertedQuotes: number;
  convertedValue: number;
  conversionRate: number;
  avgQuoteValue: number;
}

interface QuotePipeline {
  [key: string]: {
    count: number;
    value: number;
    quotes: any[];
  };
}

interface ReportChartsProps {
  monthlyTrends?: MonthlyTrend[];
  quotePipeline?: QuotePipeline;
  industryAnalysis?: any[];
}

export function ReportCharts({ monthlyTrends, quotePipeline, industryAnalysis }: ReportChartsProps) {
  if (!monthlyTrends || !quotePipeline) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading charts...</p>
        </div>
      </div>
    );
  }

  const pipelineData = {
    labels: Object.keys(quotePipeline).map(key => key.replace('_', ' ').toUpperCase()),
    datasets: [
      {
        data: Object.values(quotePipeline).map(item => item.count),
        backgroundColor: [
          '#6B7280', // draft - gray
          '#F59E0B', // pending_approval - yellow
          '#3B82F6', // sent - blue
          '#8B5CF6', // under_review - purple
          '#10B981', // approved - green
          '#EF4444', // rejected - red
          '#059669', // converted - emerald
          '#9CA3AF', // expired - gray
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Monthly Trends Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Volume Trend</h3>
          <div className="h-64">
            <Line
              data={{
                labels: monthlyTrends.map(t => t.monthName.split(' ')[0]),
                datasets: [
                  {
                    label: 'Total Quotes',
                    data: monthlyTrends.map(t => t.totalQuotes),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                  {
                    label: 'Converted',
                    data: monthlyTrends.map(t => t.convertedQuotes),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: monthlyTrends.map(t => t.monthName.split(' ')[0]),
                datasets: [
                  {
                    label: 'Total Value',
                    data: monthlyTrends.map(t => t.totalValue),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  },
                  {
                    label: 'Converted Value',
                    data: monthlyTrends.map(t => t.convertedValue),
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + Number(value).toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Pipeline and Conversion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quote Pipeline Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={pipelineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Rate Trend</h3>
          <div className="h-64">
            <Line
              data={{
                labels: monthlyTrends.map(t => t.monthName.split(' ')[0]),
                datasets: [
                  {
                    label: 'Conversion Rate (%)',
                    data: monthlyTrends.map(t => t.conversionRate),
                    borderColor: 'rgb(168, 85, 247)',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Industry Performance Chart */}
      {industryAnalysis && industryAnalysis.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance by Industry</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: industryAnalysis.slice(0, 8).map(item => item.industry),
                datasets: [
                  {
                    label: 'Total Value',
                    data: industryAnalysis.slice(0, 8).map(item => item.totalValue),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  },
                  {
                    label: 'Converted Value',
                    data: industryAnalysis.slice(0, 8).map(item => item.convertedValue),
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + Number(value).toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
