import { rateLimiterApi } from './rateLimiterApi';
import { mergeFilterOptions } from './marketingFilterUtils';

export interface FilterOptions {
  industries: string[];
  campaignStatuses: string[];
  clients: Array<{ id: number; companyName: string }>;
}

export interface MarketingSummary {
  totalClients: number;
  activeCampaigns: number;
  totalLeads: number;
  totalRevenue: number;
  avgCtr: number;
}

export interface TimeSeriesPoint {
  period: string;
  count: number;
  revenue: number | null;
}

export interface NamedCount {
  name: string;
  value: number;
}

export interface CampaignRank {
  campaignId: number;
  campaignName: string;
  leadCount: number;
  spent: number;
  status: string;
}

export interface AppliedFiltersSnapshot {
  industry: string;
  campaignStatus: string;
  clientId: number | null;
  clientName: string | null;
  dateFrom: string;
  dateTo: string;
}

export interface MarketingDashboardBundle {
  filterOptions?: FilterOptions;
  appliedFilters?: AppliedFiltersSnapshot;
  summary: MarketingSummary;
  leadsTrend: TimeSeriesPoint[];
  revenueTrend: TimeSeriesPoint[];
  channelMix: NamedCount[];
  topCampaigns: CampaignRank[];
  databaseAvailable: boolean;
  message?: string;
}

function authHeaders(apiKey: string) {
  return { 'X-API-KEY': apiKey };
}

export async function fetchMarketingFilters(apiKey: string): Promise<FilterOptions> {
  const { data } = await rateLimiterApi.get<Record<string, unknown>>('/marketing/filters', {
    headers: authHeaders(apiKey),
  });
  const fo = data.filterOptions ?? data.filter_options ?? data;
  return mergeFilterOptions(fo as FilterOptions | undefined);
}

export interface DashboardQuery {
  industry?: string;
  campaignStatus?: string;
  clientId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchMarketingDashboard(
  apiKey: string,
  query: DashboardQuery
): Promise<MarketingDashboardBundle> {
  /** Always send five dimensions so DevTools / network logs match the five filter controls. */
  const params: Record<string, string> = {
    industry: query.industry ?? '',
    campaignStatus: query.campaignStatus ?? '',
    /** String keeps query params stable for Spring (@RequestParam String clientId). */
    clientId:
      query.clientId != null && !Number.isNaN(query.clientId) ? String(query.clientId) : '',
    dateFrom: query.dateFrom ?? '',
    dateTo: query.dateTo ?? '',
  };

  const { data } = await rateLimiterApi.get<MarketingDashboardBundle>('/marketing/dashboard', {
    headers: authHeaders(apiKey),
    params,
  });
  const raw = data as Record<string, unknown>;
  const fo = raw.filterOptions ?? raw.filter_options;
  return {
    ...data,
    filterOptions: mergeFilterOptions(fo as FilterOptions | undefined),
  };
}
