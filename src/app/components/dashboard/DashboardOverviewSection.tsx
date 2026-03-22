import { Users, Megaphone, UserCheck, TrendingUp, DollarSign } from 'lucide-react';
import { MetricCard } from '../MetricCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function DashboardOverviewSection() {
  const { data, loading, error } = useApi(apiService.getDashboard);

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white/80 p-8">
        <LoadingSpinner />
      </section>
    );
  }
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <section id="overview-mock" className="space-y-6 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Overview (mock API)</h2>
          <p className="text-sm text-gray-600 mt-1">High-level KPIs and trends from the demo JSON service.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Clients"
          value={data.metrics.totalClients}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Campaigns"
          value={data.metrics.activeCampaigns}
          icon={Megaphone}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Total Leads"
          value={data.metrics.totalLeads}
          icon={UserCheck}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricCard
          title="Conversion Rate"
          value={data.metrics.conversionRate}
          icon={TrendingUp}
          format="percentage"
          trend={{ value: 3, isPositive: true }}
        />
        <MetricCard
          title="Total Revenue"
          value={data.metrics.totalRevenue}
          icon={DollarSign}
          format="currency"
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads over time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by campaign</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueByCampaign}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="campaign" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.channelPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.channelPerformance.map((entry: { name: string }, index: number) => (
                  <Cell key={entry.name + index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion funnel</h3>
          <div className="space-y-4 mt-6">
            {data.conversionFunnel.map((stage: { stage: string; count: number; percentage: number }) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                  <span className="text-sm text-gray-600">
                    {stage.count.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
