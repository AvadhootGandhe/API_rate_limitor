package com.ratelimiter.marketing.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MarketingDashboardBundleDTO {
    /** Dropdown options + filter echo (same payload as /filters, avoids a second HTTP round-trip). */
    private FilterOptionsDTO filterOptions;
    private AppliedFiltersSnapshotDTO appliedFilters;
    private MarketingSummaryDTO summary;
    private List<TimeSeriesPointDTO> leadsTrend;
    private List<TimeSeriesPointDTO> revenueTrend;
    private List<NamedCountDTO> channelMix;
    private List<CampaignRankDTO> topCampaigns;
    private boolean databaseAvailable;
    private String message;
}
