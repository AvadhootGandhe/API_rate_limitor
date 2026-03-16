import { Users, UserCheck, Target, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STAGE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

const STAGE_ICONS = {
  Lead: Users,
  Qualified: UserCheck,
  Opportunity: Target,
  Converted: CheckCircle,
};

export function LeadFunnel() {
  const { data, loading, error } = useApi(apiService.getLeads);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Lead Funnel</h1>
        <p className="text-sm text-gray-600 mt-1">Track leads through your conversion funnel stages.</p>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Funnel Visualization</h3>
        
        <div className="space-y-4">
          {data.funnel.map((stage: any, index: number) => {
            const Icon = STAGE_ICONS[stage.stage as keyof typeof STAGE_ICONS];
            const isLast = index === data.funnel.length - 1;
            
            return (
              <div key={stage.stage}>
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${STAGE_COLORS[index]}20` }}
                  >
                    <Icon size={24} style={{ color: STAGE_COLORS[index] }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{stage.count.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 ml-2">({stage.percentage}%)</span>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 rounded-full transition-all duration-500"
                        style={{
                          width: `${stage.percentage}%`,
                          backgroundColor: STAGE_COLORS[index],
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {!isLast && (
                  <div className="flex items-center justify-center my-2">
                    <div className="w-px h-8 bg-gray-200"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.funnel.map((stage: any, index: number) => {
          const Icon = STAGE_ICONS[stage.stage as keyof typeof STAGE_ICONS];
          
          return (
            <div key={stage.stage} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stage.stage}</p>
                  <p className="text-3xl font-semibold text-gray-900 mb-2">
                    {stage.count.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">
                      {stage.percentage}% of total
                    </span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${STAGE_COLORS[index]}20` }}
                >
                  <Icon size={24} style={{ color: STAGE_COLORS[index] }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Chart</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.funnel} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="stage" type="category" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {data.funnel.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={STAGE_COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Lead to Qualified</h4>
          <p className="text-3xl font-semibold text-blue-700 mb-1">44%</p>
          <p className="text-sm text-gray-600">Conversion rate from leads to qualified prospects</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Qualified to Opportunity</h4>
          <p className="text-3xl font-semibold text-purple-700 mb-1">46%</p>
          <p className="text-sm text-gray-600">Conversion rate from qualified to opportunity</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-2">Opportunity to Converted</h4>
          <p className="text-3xl font-semibold text-green-700 mb-1">39%</p>
          <p className="text-sm text-gray-600">Conversion rate from opportunity to customer</p>
        </div>
      </div>
    </div>
  );
}
