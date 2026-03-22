import type { FilterOptions } from './marketingApi';

/** Mirrors dataset.py — always show full lists even if API returns partial/empty. */
export const INDUSTRIES_FALLBACK = [
  'Ecommerce',
  'SaaS',
  'Fintech',
  'Healthcare',
  'Education',
  'Retail',
] as const;
export const STATUSES_FALLBACK = ['Active', 'Paused', 'Completed'] as const;

export function mergeFilterOptions(fo: FilterOptions | undefined | null): FilterOptions {
  const raw = fo ?? { industries: [], campaignStatuses: [], clients: [] };
  const industries = [...new Set([...INDUSTRIES_FALLBACK, ...(raw.industries ?? [])])].sort();
  const statuses = [...new Set([...STATUSES_FALLBACK, ...(raw.campaignStatuses ?? [])])].sort();
  const clientsArr = (raw as { clients?: unknown }).clients;
  const clients = (Array.isArray(clientsArr) ? clientsArr : [])
    .map((c) => {
      const row = c as Record<string, unknown>;
      const id = Number(row.id ?? row.client_id ?? 0);
      const companyName = String(row.companyName ?? row.company_name ?? '');
      return { id, companyName };
    })
    .filter((c) => c.id > 0 && c.companyName);
  const byId = new Map<number, { id: number; companyName: string }>();
  for (const c of clients) {
    if (!byId.has(c.id)) byId.set(c.id, c);
  }
  const clientsDeduped = [...byId.values()].sort((a, b) =>
    a.companyName.localeCompare(b.companyName, undefined, { sensitivity: 'base' })
  );
  return { industries, campaignStatuses: statuses, clients: clientsDeduped };
}
