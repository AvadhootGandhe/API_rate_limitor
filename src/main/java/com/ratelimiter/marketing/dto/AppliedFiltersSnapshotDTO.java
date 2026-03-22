package com.ratelimiter.marketing.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Echo of the five filter dimensions actually applied (for UI transparency).
 */
@Data
@Builder
public class AppliedFiltersSnapshotDTO {
    private String industry;
    private String campaignStatus;
    private Long clientId;
    private String clientName;
    private String dateFrom;
    private String dateTo;
}
