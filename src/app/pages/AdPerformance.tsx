import { Eye, MousePointer, TrendingUp, DollarSign, Target } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdPerformance() {
  const { data, loading, error } = useApi(apiService.getAds);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Ad Performance</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor and analyze your advertising campaign metrics.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Impressions"
          value={data.metrics.impressions}
          icon={Eye}
          trend={{ value: 14, isPositive: true }}
        />
        <MetricCard
          title="Clicks"
          value={data.metrics.clicks}
          icon={MousePointer}
          trend={{ value: 22, isPositive: true }}
        />
        <MetricCard
          title="CTR"
          value={data.metrics.ctr}
          icon={TrendingUp}
          format="percentage"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="CPC"
          value={data.metrics.cpc}
          icon={DollarSign}
          format="currency"
          trend={{ value: 5, isPositive: false }}
        />
        <MetricCard
          title="Conversions"
          value={data.metrics.conversions}
          icon={Target}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CTR Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CTR Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.ctrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`${value}%`, 'CTR']}
              />
              <Line
                type="monotone"
                dataKey="ctr"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CPC Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CPC Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.cpcTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`$${value}`, 'CPC']}
              />
              <Line
                type="monotone"
                dataKey="cpc"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversions by Campaign */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversions per Campaign</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.conversionsByCampaign}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="campaign" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="conversions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Best Performing Metric</p>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Click-Through Rate</p>
                <p className="text-sm text-green-600">+22% increase</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Optimization Opportunity</p>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Conversion Rate</p>
                <p className="text-sm text-blue-600">Focus area for growth</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Cost Efficiency</p>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Cost Per Click</p>
                <p className="text-sm text-purple-600">Trending downward</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
