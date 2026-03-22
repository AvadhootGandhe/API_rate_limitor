package com.ratelimiter.marketing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignRankDTO {
    private long campaignId;
    private String campaignName;
    private long leadCount;
    private BigDecimal spent;
    private String status;
}
