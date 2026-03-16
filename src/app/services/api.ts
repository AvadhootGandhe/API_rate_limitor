import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Mock data fallback
export const mockData = {
  dashboard: {
    metrics: {
      totalClients: 47,
      activeCampaigns: 23,
      totalLeads: 1284,
      conversionRate: 24.6,
      totalRevenue: 487500,
    },
    leadsOverTime: [
      { month: 'Jan', leads: 850 },
      { month: 'Feb', leads: 920 },
      { month: 'Mar', leads: 1050 },
      { month: 'Apr', leads: 1180 },
      { month: 'May', leads: 1100 },
      { month: 'Jun', leads: 1284 },
    ],
    revenueByCampaign: [
      { campaign: 'Spring Sale', revenue: 125000 },
      { campaign: 'Product Launch', revenue: 98000 },
      { campaign: 'Brand Awareness', revenue: 87500 },
      { campaign: 'Holiday Special', revenue: 112000 },
      { campaign: 'Retargeting', revenue: 65000 },
    ],
    channelPerformance: [
      { name: 'Google Ads', value: 35 },
      { name: 'Facebook', value: 28 },
      { name: 'LinkedIn', value: 18 },
      { name: 'Instagram', value: 12 },
      { name: 'Other', value: 7 },
    ],
    conversionFunnel: [
      { stage: 'Visitors', count: 15420, percentage: 100 },
      { stage: 'Leads', count: 4850, percentage: 31.5 },
      { stage: 'Qualified', count: 2140, percentage: 13.9 },
      { stage: 'Opportunity', count: 980, percentage: 6.4 },
      { stage: 'Converted', count: 385, percentage: 2.5 },
    ],
  },
  campaigns: [
    {
      id: 1,
      name: 'Spring Sale 2026',
      client: 'TechCorp Inc.',
      status: 'Active',
      budget: 50000,
      leadsGenerated: 428,
      conversions: 105,
      roi: 2.5,
    },
    {
      id: 2,
      name: 'Product Launch Q1',
      client: 'InnovateLabs',
      status: 'Active',
      budget: 75000,
      leadsGenerated: 512,
      conversions: 142,
      roi: 1.9,
    },
    {
      id: 3,
      name: 'Brand Awareness',
      client: 'GreenEarth Co.',
      status: 'Active',
      budget: 35000,
      leadsGenerated: 286,
      conversions: 68,
      roi: 2.1,
    },
    {
      id: 4,
      name: 'Holiday Special',
      client: 'RetailMax',
      status: 'Paused',
      budget: 60000,
      leadsGenerated: 395,
      conversions: 89,
      roi: 1.7,
    },
    {
      id: 5,
      name: 'Retargeting Campaign',
      client: 'TechCorp Inc.',
      status: 'Active',
      budget: 28000,
      leadsGenerated: 198,
      conversions: 52,
      roi: 2.3,
    },
    {
      id: 6,
      name: 'Email Marketing',
      client: 'HealthPlus',
      status: 'Completed',
      budget: 15000,
      leadsGenerated: 145,
      conversions: 41,
      roi: 2.8,
    },
    {
      id: 7,
      name: 'Social Media Boost',
      client: 'FashionHub',
      status: 'Active',
      budget: 42000,
      leadsGenerated: 356,
      conversions: 78,
      roi: 1.8,
    },
    {
      id: 8,
      name: 'Lead Generation',
      client: 'DataSync',
      status: 'Active',
      budget: 55000,
      leadsGenerated: 467,
      conversions: 118,
      roi: 2.2,
    },
  ],
  clients: [
    {
      id: 1,
      companyName: 'TechCorp Inc.',
      industry: 'Technology',
      totalCampaigns: 8,
      totalRevenue: 125000,
      performanceOverTime: [
        { month: 'Jan', revenue: 15000 },
        { month: 'Feb', revenue: 18500 },
        { month: 'Mar', revenue: 22000 },
        { month: 'Apr', revenue: 25500 },
        { month: 'May', revenue: 21000 },
        { month: 'Jun', revenue: 23000 },
      ],
      channelDistribution: [
        { channel: 'Google Ads', campaigns: 3 },
        { channel: 'LinkedIn', campaigns: 2 },
        { channel: 'Facebook', campaigns: 2 },
        { channel: 'Instagram', campaigns: 1 },
      ],
    },
    {
      id: 2,
      companyName: 'InnovateLabs',
      industry: 'SaaS',
      totalCampaigns: 5,
      totalRevenue: 98000,
      performanceOverTime: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 14500 },
        { month: 'Mar', revenue: 17000 },
        { month: 'Apr', revenue: 19500 },
        { month: 'May', revenue: 16000 },
        { month: 'Jun', revenue: 19000 },
      ],
      channelDistribution: [
        { channel: 'Google Ads', campaigns: 2 },
        { channel: 'LinkedIn', campaigns: 2 },
        { channel: 'Facebook', campaigns: 1 },
      ],
    },
    {
      id: 3,
      companyName: 'GreenEarth Co.',
      industry: 'Sustainability',
      totalCampaigns: 6,
      totalRevenue: 87500,
      performanceOverTime: [
        { month: 'Jan', revenue: 10000 },
        { month: 'Feb', revenue: 12500 },
        { month: 'Mar', revenue: 15500 },
        { month: 'Apr', revenue: 18000 },
        { month: 'May', revenue: 14500 },
        { month: 'Jun', revenue: 17000 },
      ],
      channelDistribution: [
        { channel: 'Google Ads', campaigns: 2 },
        { channel: 'Facebook', campaigns: 2 },
        { channel: 'Instagram', campaigns: 2 },
      ],
    },
  ],
  ads: {
    metrics: {
      impressions: 2458000,
      clicks: 98320,
      ctr: 4.0,
      cpc: 2.45,
      conversions: 1284,
    },
    ctrTrend: [
      { month: 'Jan', ctr: 3.2 },
      { month: 'Feb', ctr: 3.5 },
      { month: 'Mar', ctr: 3.8 },
      { month: 'Apr', ctr: 4.1 },
      { month: 'May', ctr: 3.9 },
      { month: 'Jun', ctr: 4.0 },
    ],
    cpcTrend: [
      { month: 'Jan', cpc: 2.85 },
      { month: 'Feb', cpc: 2.75 },
      { month: 'Mar', cpc: 2.60 },
      { month: 'Apr', cpc: 2.50 },
      { month: 'May', cpc: 2.48 },
      { month: 'Jun', cpc: 2.45 },
    ],
    conversionsByCampaign: [
      { campaign: 'Spring Sale', conversions: 285 },
      { campaign: 'Product Launch', conversions: 242 },
      { campaign: 'Brand Awareness', conversions: 198 },
      { campaign: 'Holiday Special', conversions: 225 },
      { campaign: 'Retargeting', conversions: 165 },
      { campaign: 'Social Media', conversions: 169 },
    ],
  },
  leads: {
    funnel: [
      { stage: 'Lead', count: 4850, percentage: 100 },
      { stage: 'Qualified', count: 2140, percentage: 44 },
      { stage: 'Opportunity', count: 980, percentage: 20 },
      { stage: 'Converted', count: 385, percentage: 8 },
    ],
  },
  tasks: {
    pending: [
      {
        id: 1,
        name: 'Review campaign analytics',
        assignedTo: 'Sarah Johnson',
        campaign: 'Spring Sale 2026',
        deadline: '2026-03-20',
      },
      {
        id: 2,
        name: 'Create ad copy',
        assignedTo: 'Mike Chen',
        campaign: 'Product Launch Q1',
        deadline: '2026-03-22',
      },
      {
        id: 3,
        name: 'Client meeting prep',
        assignedTo: 'Emily Davis',
        campaign: 'Brand Awareness',
        deadline: '2026-03-19',
      },
    ],
    inProgress: [
      {
        id: 4,
        name: 'A/B testing setup',
        assignedTo: 'David Kim',
        campaign: 'Retargeting Campaign',
        deadline: '2026-03-25',
      },
      {
        id: 5,
        name: 'Budget optimization',
        assignedTo: 'Sarah Johnson',
        campaign: 'Holiday Special',
        deadline: '2026-03-24',
      },
      {
        id: 6,
        name: 'Landing page design',
        assignedTo: 'Alex Martinez',
        campaign: 'Social Media Boost',
        deadline: '2026-03-28',
      },
    ],
    completed: [
      {
        id: 7,
        name: 'Monthly report',
        assignedTo: 'Emily Davis',
        campaign: 'Email Marketing',
        deadline: '2026-03-15',
      },
      {
        id: 8,
        name: 'Keyword research',
        assignedTo: 'Mike Chen',
        campaign: 'Lead Generation',
        deadline: '2026-03-14',
      },
    ],
  },
};

// API service functions with mock data fallback
export const apiService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.dashboard;
    }
  },

  getCampaigns: async () => {
    try {
      const response = await api.get('/campaigns');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.campaigns;
    }
  },

  getClients: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.clients;
    }
  },

  getAds: async () => {
    try {
      const response = await api.get('/ads');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.ads;
    }
  },

  getLeads: async () => {
    try {
      const response = await api.get('/leads');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.leads;
    }
  },

  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.tasks;
    }
  },

  getPerformance: async () => {
    try {
      const response = await api.get('/performance');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockData.dashboard;
    }
  },
};
