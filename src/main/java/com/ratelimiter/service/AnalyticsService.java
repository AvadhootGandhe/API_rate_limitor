package com.ratelimiter.service;

import com.ratelimiter.dto.AnalyticsResponseDTO;
import com.ratelimiter.dto.RequestLogDTO;
import com.ratelimiter.model.RequestLog;
import com.ratelimiter.model.User;
import com.ratelimiter.repository.RequestLogRepository;
import com.ratelimiter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final RequestLogRepository requestLogRepository;
    private final UserRepository userRepository;

    public AnalyticsResponseDTO getAnalytics() {
        long total = requestLogRepository.count();
        long blocked = requestLogRepository.countByStatus("blocked");
        long allowed = requestLogRepository.countByStatus("allowed");

        List<Object[]> topUsersRaw = requestLogRepository.findTopUsersByUsage();
        List<AnalyticsResponseDTO.TopUserUsage> topUsers = topUsersRaw.stream()
                .map(row -> {
                    Long userId = (Long) row[0];
                    long count = (Long) row[1];
                    Optional<User> userOpt = userRepository.findById(userId);
                    if (userOpt.isEmpty()) {
                        return null;
                    }
                    User u = userOpt.get();
                    return AnalyticsResponseDTO.TopUserUsage.builder()
                            .userId(u.getId())
                            .userName(u.getName())
                            .apiKey(u.getApiKey())
                            .requestCount(count)
                            .build();
                })
                .filter(u -> u != null)
                .toList();

        log.debug("Computed analytics: total={}, allowed={}, blocked={}", total, allowed, blocked);

        return AnalyticsResponseDTO.builder()
                .totalRequests(total)
                .allowedRequests(allowed)
                .blockedRequests(blocked)
                .topUsersByUsage(topUsers)
                .build();
    }

    public List<RequestLogDTO> getRecentLogs() {
        List<RequestLog> logs = requestLogRepository.findTop100ByOrderByTimestampDesc();
        return logs.stream()
                .map(log -> RequestLogDTO.builder()
                        .id(log.getId())
                        .userName(log.getUser() != null ? log.getUser().getName() : null)
                        .apiKey(log.getUser() != null ? log.getUser().getApiKey() : null)
                        .endpoint(log.getEndpoint())
                        .timestamp(log.getTimestamp())
                        .status(log.getStatus())
                        .build())
                .toList();
    }
}

