package com.ratelimiter.marketing.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class MarketingSummaryDTO {
    private long totalClients;
    private long activeCampaigns;
    private long totalLeads;
    private BigDecimal totalRevenue;
    private double avgCtr;
}
