package com.ratelimiter.marketing.controller;

import com.ratelimiter.marketing.dto.FilterOptionsDTO;
import com.ratelimiter.marketing.dto.MarketingDashboardBundleDTO;
import com.ratelimiter.marketing.dto.MarketingFilterParams;
import com.ratelimiter.marketing.service.MarketingDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/marketing")
@RequiredArgsConstructor
public class MarketingDashboardController {

    private final MarketingDashboardService marketingDashboardService;

    @GetMapping("/filters")
    public ResponseEntity<FilterOptionsDTO> filters() {
        return ResponseEntity.ok(marketingDashboardService.loadFilterOptions());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<MarketingDashboardBundleDTO> dashboard(
            @RequestParam(required = false, defaultValue = "") String industry,
            @RequestParam(required = false, defaultValue = "") String campaignStatus,
            @RequestParam(required = false, defaultValue = "") String clientId,
            @RequestParam(required = false, defaultValue = "") String dateFrom,
            @RequestParam(required = false, defaultValue = "") String dateTo) {

        Long clientIdLong = null;
        if (clientId != null && !clientId.isBlank()) {
            clientIdLong = Long.parseLong(clientId.trim());
        }
        LocalDate from = null;
        LocalDate to = null;
        if (dateFrom != null && !dateFrom.isBlank()) {
            from = LocalDate.parse(dateFrom.trim());
        }
        if (dateTo != null && !dateTo.isBlank()) {
            to = LocalDate.parse(dateTo.trim());
        }

        MarketingFilterParams params = MarketingFilterParams.builder()
                .industry(industry.isBlank() ? null : industry.trim())
                .campaignStatus(campaignStatus.isBlank() ? null : campaignStatus.trim())
                .clientId(clientIdLong)
                .dateFrom(from)
                .dateTo(to)
                .build();

        return ResponseEntity.ok(marketingDashboardService.loadDashboard(params));
    }
}
