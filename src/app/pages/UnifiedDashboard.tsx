import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Users,
  Megaphone,
  UserCheck,
  TrendingUp,
  DollarSign,
  KeyRound,
  Play,
  RefreshCw,
  Copy,
  CheckCircle2,
  Filter,
  Gauge,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { rateLimiterApi, type AnalyticsResponse, type CreateUserResponse } from '../services/rateLimiterApi';
import {
  fetchMarketingDashboard,
  type FilterOptions,
  type MarketingDashboardBundle,
} from '../services/marketingApi';
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
import { DashboardOverviewSection } from '../components/dashboard/DashboardOverviewSection';
import { DashboardAdPerformanceSection } from '../components/dashboard/DashboardAdPerformanceSection';
import { DashboardCampaignsSection } from '../components/dashboard/DashboardCampaignsSection';
import { DashboardClientsSection } from '../components/dashboard/DashboardClientsSection';
import { DashboardLeadFunnelSection } from '../components/dashboard/DashboardLeadFunnelSection';
import { DashboardTasksSection } from '../components/dashboard/DashboardTasksSection';

const emptyFilterOptions: FilterOptions = { industries: [], campaignStatuses: [], clients: [] };

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);
  return {
    dateFrom: from.toISOString().slice(0, 10),
    dateTo: to.toISOString().slice(0, 10),
  };
}

type BurstRow = { n: number; status: number; ok: boolean; detail?: string };

export function UnifiedDashboard() {
  const { dateFrom: defFrom, dateTo: defTo } = defaultDateRange();

  const [burstApiKey, setBurstApiKey] = useState('');
  const [burstUserInfo, setBurstUserInfo] = useState<CreateUserResponse | null>(null);
  const [burstMaxPerMinute, setBurstMaxPerMinute] = useState(10);
  const [burstUserName, setBurstUserName] = useState('Burst demo');
  const [creatingBurst, setCreatingBurst] = useState(false);
  const [copiedBurst, setCopiedBurst] = useState(false);
  const [burstRateBanner, setBurstRateBanner] = useState<string | null>(null);

  const [chartsApiKey, setChartsApiKey] = useState('');
  const [chartsUserInfo, setChartsUserInfo] = useState<CreateUserResponse | null>(null);
  const [chartsMaxPerMinute, setChartsMaxPerMinute] = useState(120);
  const [chartsUserName, setChartsUserName] = useState('Charts demo');
  const [creatingCharts, setCreatingCharts] = useState(false);
  const [copiedCharts, setCopiedCharts] = useState(false);
  const [chartsRateBanner, setChartsRateBanner] = useState<string | null>(null);

  const [bursting, setBursting] = useState(false);
  const [burstCount, setBurstCount] = useState(15);
  const [burstRows, setBurstRows] = useState<BurstRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [burstBanner, setBurstBanner] = useState<string | null>(null);

  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [industry, setIndustry] = useState<string>('All');
  const [campaignStatus, setCampaignStatus] = useState<string>('All');
  const [clientId, setClientId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState(defFrom);
  const [dateTo, setDateTo] = useState(defTo);

  const [bundle, setBundle] = useState<MarketingDashboardBundle | null>(null);
  const [loadingMarketing, setLoadingMarketing] = useState(false);
  const [marketingError, setMarketingError] = useState<string | null>(null);

  const loadMarketing = useCallback(async () => {
    if (!chartsApiKey) return;
    setLoadingMarketing(true);
    setMarketingError(null);
    try {
      const dash = await fetchMarketingDashboard(chartsApiKey, {
        industry: industry === 'All' ? '' : industry,
        campaignStatus: campaignStatus === 'All' ? '' : campaignStatus,
        clientId: clientId ? Number(clientId) : undefined,
        dateFrom,
        dateTo,
      });
      setFilterOptions(dash.filterOptions ?? emptyFilterOptions);
      setBundle(dash);
    } catch (e) {
      setMarketingError(
        axios.isAxiosError(e) ? e.message : 'Could not load marketing data. Check charts API key and backend.'
      );
    } finally {
      setLoadingMarketing(false);
    }
  }, [chartsApiKey, industry, campaignStatus, clientId, dateFrom, dateTo]);

  useEffect(() => {
    if (chartsApiKey) {
      void loadMarketing();
    }
  }, [chartsApiKey]); // eslint-disable-line react-hooks/exhaustive-deps -- bootstrap when charts key appears

  const applyFilters = () => {
    void loadMarketing();
  };

  const resetFilters = async () => {
    const d = defaultDateRange();
    setIndustry('All');
    setCampaignStatus('All');
    setClientId('');
    setDateFrom(d.dateFrom);
    setDateTo(d.dateTo);
    if (!chartsApiKey) return;
    setLoadingMarketing(true);
    setMarketingError(null);
    try {
      const dash = await fetchMarketingDashboard(chartsApiKey, {
        industry: '',
        campaignStatus: '',
        clientId: undefined,
        dateFrom: d.dateFrom,
        dateTo: d.dateTo,
      });
      setFilterOptions(dash.filterOptions ?? emptyFilterOptions);
      setBundle(dash);
    } catch (e) {
      setMarketingError(axios.isAxiosError(e) ? e.message : 'Request failed');
    } finally {
      setLoadingMarketing(false);
    }
  };

  const createBurstUser = async () => {
    setCreatingBurst(true);
    setBurstRateBanner(null);
    try {
      const { data } = await rateLimiterApi.post<CreateUserResponse>('/users', {
        name: burstUserName.trim() || 'Burst demo',
        plan_type: 'FREE',
        max_requests_per_minute: burstMaxPerMinute,
      });
      setBurstUserInfo(data);
      setBurstApiKey(data.api_key);
      setBurstRows([]);
      setAnalytics(null);
    } catch (e) {
      setBurstRateBanner(
        axios.isAxiosError(e)
          ? e.message
          : 'Failed to create burst user. Run mvn spring-boot:run (port 8080).'
      );
    } finally {
      setCreatingBurst(false);
    }
  };

  const createChartsUser = async () => {
    setCreatingCharts(true);
    setChartsRateBanner(null);
    try {
      const { data } = await rateLimiterApi.post<CreateUserResponse>('/users', {
        name: chartsUserName.trim() || 'Charts demo',
        plan_type: 'FREE',
        max_requests_per_minute: chartsMaxPerMinute,
      });
      setChartsUserInfo(data);
      setChartsApiKey(data.api_key);
    } catch (e) {
      setChartsRateBanner(
        axios.isAxiosError(e)
          ? e.message
          : 'Failed to create charts user. Run mvn spring-boot:run (port 8080).'
      );
    } finally {
      setCreatingCharts(false);
    }
  };

  const runBurst = async () => {
    if (!burstApiKey) {
      setBurstBanner('Create a burst API user in section 1 first.');
      return;
    }
    setBursting(true);
    setBurstBanner(null);
    const next: BurstRow[] = [];
    for (let i = 1; i <= burstCount; i++) {
      try {
        const res = await rateLimiterApi.get('/data', { headers: { 'X-API-KEY': burstApiKey } });
        next.push({ n: i, status: res.status, ok: true });
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          const st = e.response.status;
          const detail =
            typeof e.response.data === 'string'
              ? e.response.data
              : String(e.response.statusText);
          next.push({ n: i, status: st, ok: st < 400, detail });
        } else {
          next.push({ n: i, status: 0, ok: false, detail: 'Network error' });
        }
      }
      setBurstRows([...next]);
    }
    setBursting(false);
  };

  const loadRateAnalytics = async () => {
    if (!burstApiKey) return;
    setBurstBanner(null);
    try {
      const { data } = await rateLimiterApi.get<AnalyticsResponse>('/analytics', {
        headers: { 'X-API-KEY': burstApiKey },
      });
      setAnalytics(data);
    } catch {
      setBurstBanner('Could not load rate analytics.');
    }
  };

  const copyBurstKey = async () => {
    if (!burstApiKey) return;
    await navigator.clipboard.writeText(burstApiKey);
    setCopiedBurst(true);
    setTimeout(() => setCopiedBurst(false), 2000);
  };

  const copyChartsKey = async () => {
    if (!chartsApiKey) return;
    await navigator.clipboard.writeText(chartsApiKey);
    setCopiedCharts(true);
    setTimeout(() => setCopiedCharts(false), 2000);
  };

  const ctrDisplay = useMemo(() => {
    const v = bundle?.summary?.avgCtr ?? 0;
    if (v <= 1 && v >= 0) return Math.round(v * 10000) / 100;
    return v;
  }, [bundle]);

  const revenueTrendData = useMemo(() => {
    return (bundle?.revenueTrend ?? []).map((p) => ({
      period: p.period,
      revenue: Number(p.revenue ?? 0),
    }));
  }, [bundle]);

  const pieData = useMemo(() => {
    const m = bundle?.channelMix ?? [];
    return (m.length ? m : [{ name: 'No data', value: 1 }]) as { name: string; value: number }[];
  }, [bundle?.channelMix]);

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-16">
      <header className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg shadow-blue-950/20 px-6 py-8 sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-violet-500/15 blur-2xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest text-blue-200/90">MarketingHub</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Unified operations dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Rate-limited API demos, live SQLite marketing analytics, and mock portfolio data — everything on one scrollable page.
            Create two API users: one for <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">GET /api/data</code> (burst) and one
            for <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/api/marketing/*</code> (charts), each with its own per-minute bucket.
          </p>
        </div>
      </header>

      {/* 1 — Burst API user (/api/data) */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <KeyRound className="text-blue-600" size={20} />
          1. Burst API user — <code className="text-sm font-normal bg-gray-100 px-1 rounded">/api/data</code>
        </div>
        <p className="text-xs text-gray-500">
          This key is used for the burst test and for endpoints that count against the <strong>burst</strong> per-minute limit.
        </p>
        {burstRateBanner && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            {burstRateBanner}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500">User name</label>
            <input
              value={burstUserName}
              onChange={(e) => setBurstUserName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max requests / minute (burst bucket)</label>
            <input
              type="number"
              min={1}
              value={burstMaxPerMinute}
              onChange={(e) => setBurstMaxPerMinute(Number(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={createBurstUser}
              disabled={creatingBurst}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <KeyRound size={16} />
              {creatingBurst ? 'Creating…' : 'Create burst user'}
            </button>
          </div>
        </div>
        {burstUserInfo && (
          <div className="flex flex-wrap items-center gap-2 text-sm rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
            <span className="text-gray-600">Key:</span>
            <code className="text-xs bg-white px-2 py-1 rounded border max-w-md truncate">{burstApiKey}</code>
            <button
              type="button"
              onClick={copyBurstKey}
              className="inline-flex items-center gap-1 text-xs border rounded px-2 py-1 bg-white"
            >
              {copiedBurst ? <CheckCircle2 size={12} className="text-green-600" /> : <Copy size={12} />}
              {copiedBurst ? 'Copied' : 'Copy'}
            </button>
            <span className="text-gray-500">Limit {burstUserInfo.max_requests_per_minute}/min (burst user)</span>
          </div>
        )}
      </section>

      {/* 2 — Burst test (separate from API key + marketing) */}
      <section className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-gray-900 p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <Gauge className="text-gray-400" size={20} />
          2. Burst test — rate limit on <code className="text-sm font-mono bg-gray-100 px-1 rounded">/api/data</code>
        </div>
        <p className="text-xs text-gray-500">
          Each request here consumes your per-minute quota. Use a low limit (e.g. 2) to see many <strong>429</strong> responses.
        </p>
        {burstBanner && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            {burstBanner}
          </div>
        )}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500">Burst size</label>
            <input
              type="number"
              min={1}
              max={100}
              value={burstCount}
              onChange={(e) => setBurstCount(Number(e.target.value))}
              className="mt-1 w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <button
            type="button"
            onClick={runBurst}
            disabled={bursting || !burstApiKey}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg disabled:opacity-50"
          >
            <Play size={16} />
            {bursting ? 'Sending…' : 'Run burst'}
          </button>
          <button
            type="button"
            onClick={loadRateAnalytics}
            disabled={!burstApiKey}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Rate analytics
          </button>
        </div>
        {burstRows.length > 0 && (
          <p className="text-xs text-gray-600">
            Last run: {burstRows.filter((r) => r.ok).length} ok, {burstRows.filter((r) => r.status === 429).length} rate
            limited (of {burstRows.length})
          </p>
        )}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div className="rounded-lg border border-gray-100 p-3 bg-gray-50/50">
              Allowed <strong className="text-green-700">{analytics.allowedRequests}</strong>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 bg-gray-50/50">
              Blocked <strong className="text-red-700">{analytics.blockedRequests}</strong>
            </div>
            <div className="rounded-lg border border-gray-100 p-3 bg-gray-50/50">
              Total <strong>{analytics.totalRequests}</strong>
            </div>
          </div>
        )}
      </section>

      {/* 3 — Charts API user (/api/marketing/*) */}
      <section className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-violet-500 p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <KeyRound className="text-violet-600" size={20} />
          3. Charts API user — <code className="text-sm font-normal bg-gray-100 px-1 rounded">/api/marketing/*</code>
        </div>
        <p className="text-xs text-gray-500">
          Separate bucket from burst: filters and dashboard calls use this key only. Set a higher limit (e.g. 120/min) for smooth chart refreshes.
        </p>
        {chartsRateBanner && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            {chartsRateBanner}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500">User name</label>
            <input
              value={chartsUserName}
              onChange={(e) => setChartsUserName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max requests / minute (charts bucket)</label>
            <input
              type="number"
              min={1}
              value={chartsMaxPerMinute}
              onChange={(e) => setChartsMaxPerMinute(Number(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={createChartsUser}
              disabled={creatingCharts}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 disabled:opacity-50"
            >
              <KeyRound size={16} />
              {creatingCharts ? 'Creating…' : 'Create charts user'}
            </button>
          </div>
        </div>
        {chartsUserInfo && (
          <div className="flex flex-wrap items-center gap-2 text-sm rounded-lg bg-violet-50 border border-violet-100 px-3 py-2">
            <span className="text-gray-600">Key:</span>
            <code className="text-xs bg-white px-2 py-1 rounded border max-w-md truncate">{chartsApiKey}</code>
            <button
              type="button"
              onClick={copyChartsKey}
              className="inline-flex items-center gap-1 text-xs border rounded px-2 py-1 bg-white"
            >
              {copiedCharts ? <CheckCircle2 size={12} className="text-green-600" /> : <Copy size={12} />}
              {copiedCharts ? 'Copied' : 'Copy'}
            </button>
            <span className="text-gray-500">Limit {chartsUserInfo.max_requests_per_minute}/min (charts user)</span>
          </div>
        )}
      </section>

      {!chartsApiKey && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/80 p-8 text-center text-gray-600 text-sm">
          <Database className="mx-auto mb-2 text-gray-400" size={28} />
          Create a <strong>charts API user</strong> in section 3 to unlock filters and charts backed by{' '}
          <code className="text-xs">marketing_agency.db</code>.
        </div>
      )}

      {chartsApiKey && (
        <>
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <Filter size={18} />
              4. Marketing data & filters
            </div>
            <p className="text-xs text-gray-500">
              Charts read SQLite tables (<code className="bg-gray-100 px-1 rounded">clients</code>,{' '}
              <code className="bg-gray-100 px-1 rounded">campaigns</code>, <code className="bg-gray-100 px-1 rounded">leads</code>,{' '}
              <code className="bg-gray-100 px-1 rounded">conversions</code>,{' '}
              <code className="bg-gray-100 px-1 rounded">performance_metrics</code>) from{' '}
              <code className="bg-gray-100 px-1 rounded">marketing_agency.db</code>. Each <strong>Apply</strong> sends one{' '}
              <code className="bg-gray-100 px-1 rounded">GET /api/marketing/dashboard</code> with <strong>five</strong> query params.
              These calls use your <strong>charts</strong> per-minute quota (section 3), independent of the burst user in section 1.
              Industry and status lists include defaults from <code className="bg-gray-100 px-1 rounded">dataset.py</code> merged with your DB.
              Choosing a <strong>client</strong> scopes the dashboard to that company (we reset industry to <strong>All</strong> so it does not fight the client filter).
            </p>
            {bundle?.appliedFilters && (
              <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs text-gray-800">
                <span className="font-semibold text-gray-900">Applied filters (server echo):</span>{' '}
                Industry <strong>{bundle.appliedFilters.industry}</strong> · Status{' '}
                <strong>{bundle.appliedFilters.campaignStatus}</strong> · Client{' '}
                <strong>
                  {bundle.appliedFilters.clientId != null
                    ? `${bundle.appliedFilters.clientName ?? ''} (#${bundle.appliedFilters.clientId})`
                    : 'All'}
                </strong>{' '}
                · From <strong>{bundle.appliedFilters.dateFrom}</strong> · To{' '}
                <strong>{bundle.appliedFilters.dateTo}</strong>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <div>
                <label className="text-xs text-gray-500">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="All">All industries</option>
                  {(filterOptions?.industries ?? []).map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Campaign status</label>
                <select
                  value={campaignStatus}
                  onChange={(e) => setCampaignStatus(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="All">All statuses</option>
                  {(filterOptions?.campaignStatuses ?? []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Client</label>
                <select
                  value={clientId}
                  onChange={(e) => {
                    const v = e.target.value;
                    setClientId(v);
                    if (v) setIndustry('All');
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All clients</option>
                  {(filterOptions?.clients ?? []).map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={applyFilters}
                  disabled={loadingMarketing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2 border border-gray-200 text-sm rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {marketingError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{marketingError}</div>
          )}

          {loadingMarketing && !bundle && <LoadingSpinner />}

          {bundle && (
            <>
              {bundle.message && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex gap-2">
                  <AlertTriangle size={18} />
                  {bundle.message}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                  title="Clients (filtered)"
                  value={bundle.summary.totalClients}
                  icon={Users}
                />
                <MetricCard
                  title="Active campaigns"
                  value={bundle.summary.activeCampaigns}
                  icon={Megaphone}
                />
                <MetricCard
                  title="Leads in range"
                  value={bundle.summary.totalLeads}
                  icon={UserCheck}
                />
                <MetricCard
                  title="Avg CTR"
                  value={ctrDisplay}
                  icon={TrendingUp}
                  format="percentage"
                />
                <MetricCard
                  title="Revenue"
                  value={Number(bundle.summary.totalRevenue)}
                  icon={DollarSign}
                  format="currency"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by month</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bundle.leadsTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by month</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Impressions by channel</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top campaigns (by leads)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500">
                          <th className="pb-2 pr-4">Campaign</th>
                          <th className="pb-2 pr-4">Status</th>
                          <th className="pb-2 pr-4">Leads</th>
                          <th className="pb-2">Spend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bundle.topCampaigns.map((c) => (
                          <tr key={c.campaignId} className="border-b border-gray-50">
                            <td className="py-2 pr-4 font-medium text-gray-900">{c.campaignName}</td>
                            <td className="py-2 pr-4 text-gray-600">{c.status}</td>
                            <td className="py-2 pr-4">{c.leadCount.toLocaleString()}</td>
                            <td className="py-2">${Number(c.spent).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div className="relative pt-6">
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
          aria-hidden
        />
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 pt-10 pb-2">
          Portfolio & demo data
        </p>
        <p className="text-center text-sm text-gray-500 max-w-2xl mx-auto mb-12">
          The sections below load from the Vite mock JSON API (same data as before, now inline — no separate pages or tabs).
        </p>
        <div className="space-y-20">
          <DashboardOverviewSection />
          <DashboardAdPerformanceSection />
          <DashboardCampaignsSection />
          <DashboardClientsSection />
          <DashboardLeadFunnelSection />
          <DashboardTasksSection />
        </div>
      </div>
    </div>
  );
}
