import { useState } from 'react';
import { Building2, TrendingUp, Megaphone, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { useApi } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardClientsSection() {
  const { data, loading, error } = useApi(apiService.getClients);
  const [selectedClient, setSelectedClient] = useState(0);

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white/80 p-8">
        <LoadingSpinner />
      </section>
    );
  }
  if (error) return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return null;

  const client = data[selectedClient];

  return (
    <section id="clients" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Client insights</h2>
        <p className="text-sm text-gray-600 mt-1">Per-client revenue, channels, and performance trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map(
          (
            c: {
              id: number;
              companyName: string;
              industry: string;
            },
            index: number
          ) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setSelectedClient(index)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedClient === index
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedClient === index ? 'bg-blue-600' : 'bg-gray-100'
                  }`}
                >
                  <Building2 size={24} className={selectedClient === index ? 'text-white' : 'text-gray-600'} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{c.companyName}</h3>
                  <p className="text-sm text-gray-600">{c.industry}</p>
                </div>
              </div>
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Company name</p>
              <p className="text-xl font-semibold text-gray-900">{client.companyName}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total campaigns</p>
              <p className="text-xl font-semibold text-gray-900">{client.totalCampaigns}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Megaphone size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total revenue generated</p>
              <p className="text-xl font-semibold text-gray-900">${client.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign performance over time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={client.performanceOverTime}>
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
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={client.channelDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="channel" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="campaigns" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Industry: {client.industry}</h3>
            <p className="text-sm text-gray-600">
              This client operates in the {client.industry.toLowerCase()} sector with {client.totalCampaigns} active
              campaigns generating ${client.totalRevenue.toLocaleString()} in total revenue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
