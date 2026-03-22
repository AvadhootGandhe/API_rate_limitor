package com.ratelimiter.marketing.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FilterOptionsDTO {
    private List<String> industries;
    private List<String> campaignStatuses;
    private List<ClientOptionDTO> clients;
}
