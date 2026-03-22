package com.ratelimiter.marketing.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class MarketingFilterParams {
    private String industry;
    private String campaignStatus;
    private Long clientId;
    private LocalDate dateFrom;
    private LocalDate dateTo;
}
