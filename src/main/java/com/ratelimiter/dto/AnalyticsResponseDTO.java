package com.ratelimiter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponseDTO {

    private long totalRequests;
    private long allowedRequests;
    private long blockedRequests;
    private List<TopUserUsage> topUsersByUsage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopUserUsage {
        private Long userId;
        private String userName;
        private String apiKey;
        private long requestCount;
    }
}

