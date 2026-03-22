import { useState } from 'react';
import axios from 'axios';
import {
  Gauge,
  KeyRound,
  Play,
  RefreshCw,
  Copy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { rateLimiterApi, type AnalyticsResponse, type CreateUserResponse } from '../services/rateLimiterApi';

type BurstRow = { n: number; status: number; ok: boolean; detail?: string };

export function RateLimiterDemo() {
  const [name, setName] = useState('Demo user');
  const [maxPerMinute, setMaxPerMinute] = useState(5);
  const [apiKey, setApiKey] = useState('');
  const [userInfo, setUserInfo] = useState<CreateUserResponse | null>(null);

  const [creating, setCreating] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [burstCount, setBurstCount] = useState(20);
  const [rows, setRows] = useState<BurstRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createUser = async () => {
    setCreating(true);
    setBanner(null);
    try {
      const { data } = await rateLimiterApi.post<CreateUserResponse>('/users', {
        name: name.trim() || 'Demo user',
        plan_type: 'FREE',
        max_requests_per_minute: maxPerMinute,
      });
      setUserInfo(data);
      setApiKey(data.api_key);
      setRows([]);
      setAnalytics(null);
    } catch (e) {
      setBanner(
        axios.isAxiosError(e)
          ? e.message + (e.response?.data ? ` — ${JSON.stringify(e.response.data)}` : '')
          : 'Failed to create user. Is Spring Boot running on port 8080?'
      );
    } finally {
      setCreating(false);
    }
  };

  const runBurst = async () => {
    if (!apiKey) {
      setBanner('Create a user first to get an API key.');
      return;
    }
    setBursting(true);
    setBanner(null);
    const next: BurstRow[] = [];
    for (let i = 1; i <= burstCount; i++) {
      try {
        const res = await rateLimiterApi.get('/data', {
          headers: { 'X-API-KEY': apiKey },
        });
        next.push({ n: i, status: res.status, ok: true });
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          const st = e.response.status;
          const detail =
            typeof e.response.data === 'string'
              ? e.response.data
              : (e.response.data as { message?: string })?.message ?? e.response.statusText;
          next.push({ n: i, status: st, ok: st < 400, detail });
        } else {
          next.push({ n: i, status: 0, ok: false, detail: 'Network error' });
        }
      }
      setRows([...next]);
    }
    setBursting(false);
  };

  const loadAnalytics = async () => {
    if (!apiKey) {
      setBanner('Create a user first.');
      return;
    }
    setLoadingAnalytics(true);
    setBanner(null);
    try {
      const { data } = await rateLimiterApi.get<AnalyticsResponse>('/analytics', {
        headers: { 'X-API-KEY': apiKey },
      });
      setAnalytics(data);
    } catch (e) {
      setBanner(
        axios.isAxiosError(e) ? e.message : 'Could not load analytics.'
      );
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const copyKey = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Gauge size={22} />
          <span className="text-sm font-medium uppercase tracking-wide">API</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Rate limiter demo</h1>
        <p className="text-sm text-gray-600 mt-1">
          Run <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">mvn spring-boot:run</code> so the API is on{' '}
          <strong>localhost:8080</strong>. Vite proxies <code className="text-xs bg-gray-100 px-1 rounded">/api</code> to
          it while you use <code className="text-xs bg-gray-100 px-1 rounded">npm run dev</code>.
        </p>
      </div>

      {banner && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <span>{banner}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">1. Create a user</h2>
        <p className="text-sm text-gray-600">
          Lower <strong>max requests / minute</strong> to see <span className="text-red-600 font-medium">429</span>{' '}
          quickly (token bucket refills each minute).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max requests per minute</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={maxPerMinute}
              onChange={(e) => setMaxPerMinute(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={createUser}
          disabled={creating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <KeyRound size={18} />
          {creating ? 'Creating…' : 'Create user & get API key'}
        </button>

        {userInfo && (
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 space-y-2 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-700">
              <span>
                <strong>ID</strong> {userInfo.id}
              </span>
              <span>
                <strong>Plan</strong> {userInfo.plan_type}
              </span>
              <span>
                <strong>Limit</strong> {userInfo.max_requests_per_minute}/min
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs break-all bg-white px-2 py-1 rounded border border-gray-200 flex-1 min-w-0">
                {apiKey}
              </code>
              <button
                type="button"
                onClick={copyKey}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-100"
              >
                {copied ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">2. Fire requests to GET /api/data</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Requests in burst</label>
            <input
              type="number"
              min={1}
              max={200}
              value={burstCount}
              onChange={(e) => setBurstCount(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <button
            type="button"
            onClick={runBurst}
            disabled={bursting || !apiKey}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            <Play size={18} />
            {bursting ? 'Sending…' : 'Run burst'}
          </button>
          <button
            type="button"
            onClick={loadAnalytics}
            disabled={loadingAnalytics || !apiKey}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loadingAnalytics ? 'animate-spin' : ''} />
            Refresh analytics
          </button>
        </div>

        {rows.length > 0 && (
          <div className="border border-gray-100 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">HTTP</th>
                  <th className="px-3 py-2 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-t border-gray-100">
                    <td className="px-3 py-1.5 text-gray-500">{r.n}</td>
                    <td className="px-3 py-1.5 font-mono">{r.status}</td>
                    <td className="px-3 py-1.5">
                      {r.ok ? (
                        <span className="inline-flex items-center gap-1 text-green-700">
                          <CheckCircle2 size={14} /> OK
                        </span>
                      ) : r.status === 429 ? (
                        <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                          <XCircle size={14} /> Rate limited
                        </span>
                      ) : (
                        <span className="text-red-600">{r.detail ?? 'Error'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-xs text-gray-500 uppercase">Total logged</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalRequests}</p>
            </div>
            <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
              <p className="text-xs text-green-800 uppercase">Allowed</p>
              <p className="text-2xl font-semibold text-green-800">{analytics.allowedRequests}</p>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
              <p className="text-xs text-red-800 uppercase">Blocked</p>
              <p className="text-2xl font-semibold text-red-800">{analytics.blockedRequests}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
