package com.ratelimiter.marketing.service;

import com.ratelimiter.marketing.config.MarketingDataSourceConfig;
import com.ratelimiter.marketing.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

@Service
@Slf4j
public class MarketingDashboardService {

    /** Matches {@code dataset.py} so dropdowns always list all options, not only DISTINCT from sampled rows. */
    private static final List<String> DATASET_INDUSTRIES = List.of(
            "Ecommerce", "SaaS", "Fintech", "Healthcare", "Education", "Retail");
    private static final List<String> DATASET_CAMPAIGN_STATUSES = List.of(
            "Active", "Paused", "Completed");

    private final JdbcTemplate marketingJdbc;

    public MarketingDashboardService(
            @Qualifier(MarketingDataSourceConfig.MARKETING_JDBC) JdbcTemplate marketingJdbc) {
        this.marketingJdbc = marketingJdbc;
    }

    public boolean isDatabasePresent() {
        return Files.isRegularFile(Path.of("marketing_agency.db"));
    }

    public FilterOptionsDTO loadFilterOptions() {
        if (!isDatabasePresent()) {
            return FilterOptionsDTO.builder()
                    .industries(List.of())
                    .campaignStatuses(List.of())
                    .clients(List.of())
                    .build();
        }
        try {
            List<String> industriesDb = marketingJdbc.query(
                    "SELECT DISTINCT industry FROM clients WHERE industry IS NOT NULL",
                    (rs, i) -> rs.getString(1));
            LinkedHashSet<String> industriesSet = new LinkedHashSet<>(DATASET_INDUSTRIES);
            industriesSet.addAll(industriesDb);
            List<String> industries = industriesSet.stream().sorted().toList();

            List<String> statusesDb = marketingJdbc.query(
                    "SELECT DISTINCT status FROM campaigns WHERE status IS NOT NULL",
                    (rs, i) -> rs.getString(1));
            LinkedHashSet<String> statusesSet = new LinkedHashSet<>(DATASET_CAMPAIGN_STATUSES);
            statusesSet.addAll(statusesDb);
            List<String> statuses = statusesSet.stream().sorted().toList();
            List<ClientOptionDTO> clients = marketingJdbc.query(
                    "SELECT client_id, company_name FROM clients ORDER BY company_name",
                    (rs, i) -> ClientOptionDTO.builder()
                            .id(rs.getLong("client_id"))
                            .companyName(rs.getString("company_name"))
                            .build());
            return FilterOptionsDTO.builder()
                    .industries(industries)
                    .campaignStatuses(statuses)
                    .clients(clients)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to load marketing filter options: {}", e.getMessage());
            return FilterOptionsDTO.builder()
                    .industries(List.of())
                    .campaignStatuses(List.of())
                    .clients(List.of())
                    .build();
        }
    }

    public MarketingDashboardBundleDTO loadDashboard(MarketingFilterParams raw) {
        if (!isDatabasePresent()) {
            return MarketingDashboardBundleDTO.builder()
                    .databaseAvailable(false)
                    .message("Run dataset.py to create marketing_agency.db in the project root.")
                    .filterOptions(FilterOptionsDTO.builder()
                            .industries(List.of())
                            .campaignStatuses(List.of())
                            .clients(List.of())
                            .build())
                    .appliedFilters(null)
                    .summary(emptySummary())
                    .leadsTrend(List.of())
                    .revenueTrend(List.of())
                    .channelMix(List.of())
                    .topCampaigns(List.of())
                    .build();
        }

        LocalDate from = raw.getDateFrom() != null ? raw.getDateFrom() : LocalDate.of(2000, 1, 1);
        LocalDate to = raw.getDateTo() != null ? raw.getDateTo() : LocalDate.now();
        String industry = blankToNull(raw.getIndustry());
        String status = blankToNull(raw.getCampaignStatus());
        Long clientId = raw.getClientId();

        try {
            FilterOptionsDTO filterOptions = loadFilterOptions();
            AppliedFiltersSnapshotDTO applied = buildAppliedSnapshot(industry, status, clientId, from, to);

            MarketingSummaryDTO summary = querySummary(industry, status, clientId, from, to);
            List<TimeSeriesPointDTO> leadsTrend = queryLeadsTrend(industry, status, clientId, from, to);
            List<TimeSeriesPointDTO> revenueTrend = queryRevenueTrend(industry, status, clientId, from, to);
            List<NamedCountDTO> channelMix = queryChannelMix(industry, status, clientId, from, to);
            List<CampaignRankDTO> top = queryTopCampaigns(industry, status, clientId, from, to);

            return MarketingDashboardBundleDTO.builder()
                    .databaseAvailable(true)
                    .filterOptions(filterOptions)
                    .appliedFilters(applied)
                    .summary(summary)
                    .leadsTrend(leadsTrend)
                    .revenueTrend(revenueTrend)
                    .channelMix(channelMix)
                    .topCampaigns(top)
                    .build();
        } catch (Exception e) {
            log.error("Marketing dashboard query failed", e);
            return MarketingDashboardBundleDTO.builder()
                    .databaseAvailable(true)
                    .message("Query error: " + e.getMessage())
                    .filterOptions(loadFilterOptions())
                    .appliedFilters(buildAppliedSnapshot(industry, status, clientId, from, to))
                    .summary(emptySummary())
                    .leadsTrend(List.of())
                    .revenueTrend(List.of())
                    .channelMix(List.of())
                    .topCampaigns(List.of())
                    .build();
        }
    }

    private AppliedFiltersSnapshotDTO buildAppliedSnapshot(
            String industry, String status, Long clientId, LocalDate from, LocalDate to) {
        String clientName = null;
        if (clientId != null && isDatabasePresent()) {
            try {
                clientName = marketingJdbc.queryForObject(
                        "SELECT company_name FROM clients WHERE client_id = ?",
                        String.class,
                        clientId);
            } catch (Exception ignored) {
                clientName = "(unknown)";
            }
        }
        return AppliedFiltersSnapshotDTO.builder()
                .industry(industry != null ? industry : "All")
                .campaignStatus(status != null ? status : "All")
                .clientId(clientId)
                .clientName(clientName)
                .dateFrom(from.toString())
                .dateTo(to.toString())
                .build();
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank() || "All".equalsIgnoreCase(s.trim())) {
            return null;
        }
        return s.trim();
    }

    private MarketingSummaryDTO emptySummary() {
        return MarketingSummaryDTO.builder()
                .totalClients(0)
                .activeCampaigns(0)
                .totalLeads(0)
                .totalRevenue(BigDecimal.ZERO)
                .avgCtr(0)
                .build();
    }

    private MarketingSummaryDTO querySummary(String industry, String campaignStatus, Long clientId,
                                             LocalDate from, LocalDate to) {
        List<Object> a1 = new ArrayList<>();
        StringBuilder c = new StringBuilder("SELECT COUNT(*) FROM clients cl WHERE 1=1 ");
        appendClientFilters(c, a1, industry, clientId);
        Long totalClients = marketingJdbc.queryForObject(c.toString(), Long.class, a1.toArray());

        List<Object> a2 = new ArrayList<>();
        StringBuilder q2 = new StringBuilder("""
                SELECT COUNT(*) FROM campaigns cam
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE cam.status = 'Active'
                """);
        appendClientFilters(q2, a2, industry, clientId);
        appendCampaignStatus(q2, a2, campaignStatus);
        Long active = marketingJdbc.queryForObject(q2.toString(), Long.class, a2.toArray());

        List<Object> a3 = new ArrayList<>();
        StringBuilder q3 = new StringBuilder("""
                SELECT COUNT(l.lead_id) FROM leads l
                JOIN campaigns cam ON cam.campaign_id = l.campaign_id
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE date(l.created_at) BETWEEN date(?) AND date(?)
                """);
        a3.add(from.toString());
        a3.add(to.toString());
        appendClientFilters(q3, a3, industry, clientId);
        appendCampaignStatus(q3, a3, campaignStatus);
        Long leads = marketingJdbc.queryForObject(q3.toString(), Long.class, a3.toArray());

        List<Object> a4 = new ArrayList<>();
        StringBuilder q4 = new StringBuilder("""
                SELECT COALESCE(SUM(cv.revenue), 0) FROM conversions cv
                JOIN leads l ON l.lead_id = cv.lead_id
                JOIN campaigns cam ON cam.campaign_id = l.campaign_id
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE date(cv.converted_at) BETWEEN date(?) AND date(?)
                """);
        a4.add(from.toString());
        a4.add(to.toString());
        appendClientFilters(q4, a4, industry, clientId);
        appendCampaignStatus(q4, a4, campaignStatus);
        BigDecimal revenue = marketingJdbc.queryForObject(q4.toString(), BigDecimal.class, a4.toArray());

        List<Object> a5 = new ArrayList<>();
        StringBuilder q5 = new StringBuilder("""
                SELECT COALESCE(AVG(pm.ctr), 0) FROM performance_metrics pm
                JOIN ads a ON a.ad_id = pm.ad_id
                JOIN campaigns cam ON cam.campaign_id = a.campaign_id
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE date(pm.recorded_date) BETWEEN date(?) AND date(?)
                """);
        a5.add(from.toString());
        a5.add(to.toString());
        appendClientFilters(q5, a5, industry, clientId);
        appendCampaignStatus(q5, a5, campaignStatus);
        Double avgCtr = marketingJdbc.queryForObject(q5.toString(), Double.class, a5.toArray());

        return MarketingSummaryDTO.builder()
                .totalClients(totalClients != null ? totalClients : 0L)
                .activeCampaigns(active != null ? active : 0L)
                .totalLeads(leads != null ? leads : 0L)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .avgCtr(avgCtr != null ? avgCtr : 0d)
                .build();
    }

    /**
     * Filters on {@code clients} alias {@code cl}. When {@code clientId} is set, only that row is targeted —
     * applying {@code industry} as well would fail whenever the selected industry does not match that client's
     * industry (common when user picks a client after narrowing by industry).
     */
    private void appendClientFilters(StringBuilder sql, List<Object> args, String industry, Long clientId) {
        if (clientId != null) {
            sql.append(" AND cl.client_id = ?");
            args.add(clientId);
        } else if (industry != null) {
            sql.append(" AND cl.industry = ?");
            args.add(industry);
        }
    }

    private void appendCampaignStatus(StringBuilder sql, List<Object> args, String campaignStatus) {
        if (campaignStatus != null) {
            sql.append(" AND cam.status = ?");
            args.add(campaignStatus);
        }
    }

    private List<TimeSeriesPointDTO> queryLeadsTrend(String industry, String campaignStatus, Long clientId,
                                                     LocalDate from, LocalDate to) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
                SELECT strftime('%Y-%m', l.created_at) AS period, COUNT(*) AS cnt
                FROM leads l
                JOIN campaigns cam ON cam.campaign_id = l.campaign_id
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE date(l.created_at) BETWEEN date(?) AND date(?)
                """);
        args.add(from.toString());
        args.add(to.toString());
        appendClientFilters(sql, args, industry, clientId);
        appendCampaignStatus(sql, args, campaignStatus);
        sql.append(" GROUP BY period ORDER BY period");
        return marketingJdbc.query(sql.toString(), (rs, i) -> TimeSeriesPointDTO.builder()
                .period(rs.getString("period"))
                .count(rs.getLong("cnt"))
                .revenue(null)
                .build(), args.toArray());
    }

    private List<TimeSeriesPointDTO> queryRevenueTrend(String industry, String campaignStatus, Long clientId,
                                                       LocalDate from, LocalDate to) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
                SELECT strftime('%Y-%m', cv.converted_at) AS period,
                       COALESCE(SUM(cv.revenue), 0) AS rev
                FROM conversions cv
                JOIN leads l ON l.lead_id = cv.lead_id
                JOIN campaigns cam ON cam.campaign_id = l.campaign_id
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE date(cv.converted_at) BETWEEN date(?) AND date(?)
                """);
        args.add(from.toString());
        args.add(to.toString());
        appendClientFilters(sql, args, industry, clientId);
        appendCampaignStatus(sql, args, campaignStatus);
        sql.append(" GROUP BY period ORDER BY period");
        return marketingJdbc.query(sql.toString(), (rs, i) -> TimeSeriesPointDTO.builder()
                .period(rs.getString("period"))
                .count(0)
                .revenue(rs.getBigDecimal("rev"))
                .build(), args.toArray());
    }

    private List<NamedCountDTO> queryChannelMix(String industry, String campaignStatus, Long clientId,
                                                LocalDate from, LocalDate to) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
                SELECT ch.channel_name AS name,
                       CAST(SUM(pm.impressions) AS REAL) AS value
                FROM performance_metrics pm
                JOIN ads a ON a.ad_id = pm.ad_id
                JOIN channels ch ON ch.channel_id = a.channel_id
                JOIN campaigns cam ON cam.campaign_id = a.campaign_id
                JOIN clients cl ON cl.client_id = cam.client_id
                WHERE date(pm.recorded_date) BETWEEN date(?) AND date(?)
                """);
        args.add(from.toString());
        args.add(to.toString());
        appendClientFilters(sql, args, industry, clientId);
        appendCampaignStatus(sql, args, campaignStatus);
        sql.append(" GROUP BY ch.channel_id, ch.channel_name ORDER BY value DESC");
        return marketingJdbc.query(sql.toString(), (rs, i) -> NamedCountDTO.builder()
                .name(rs.getString("name"))
                .value(rs.getDouble("value"))
                .build(), args.toArray());
    }

    private List<CampaignRankDTO> queryTopCampaigns(String industry, String campaignStatus, Long clientId,
                                                    LocalDate from, LocalDate to) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
                SELECT cam.campaign_id, cam.campaign_name, cam.status,
                       COUNT(l.lead_id) AS lead_count,
                       COALESCE(b.spent, 0) AS spent
                FROM campaigns cam
                JOIN clients cl ON cl.client_id = cam.client_id
                LEFT JOIN leads l ON l.campaign_id = cam.campaign_id
                    AND date(l.created_at) BETWEEN date(?) AND date(?)
                LEFT JOIN budgets b ON b.campaign_id = cam.campaign_id
                WHERE 1=1
                """);
        args.add(from.toString());
        args.add(to.toString());
        appendClientFilters(sql, args, industry, clientId);
        appendCampaignStatus(sql, args, campaignStatus);
        sql.append("""
                GROUP BY cam.campaign_id, cam.campaign_name, cam.status, b.spent
                ORDER BY lead_count DESC
                LIMIT 12
                """);
        return marketingJdbc.query(sql.toString(), (rs, i) -> CampaignRankDTO.builder()
                .campaignId(rs.getLong("campaign_id"))
                .campaignName(rs.getString("campaign_name"))
                .status(rs.getString("status"))
                .leadCount(rs.getLong("lead_count"))
                .spent(rs.getBigDecimal("spent"))
                .build(), args.toArray());
    }
}
