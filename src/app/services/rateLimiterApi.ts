import axios from 'axios';

/** Calls the Spring rate-limiter API (proxied to :8080 in dev). */
export const rateLimiterApi = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export interface CreateUserResponse {
  id: number;
  name: string;
  plan_type: string;
  api_key: string;
  max_requests_per_minute: number;
}

export interface AnalyticsResponse {
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  topUsersByUsage: Array<{
    userId: number;
    userName: string;
    apiKey: string;
    requestCount: number;
  }>;
}
