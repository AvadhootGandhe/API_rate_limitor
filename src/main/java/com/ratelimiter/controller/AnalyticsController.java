package com.ratelimiter.controller;

import com.ratelimiter.dto.AnalyticsResponseDTO;
import com.ratelimiter.dto.RequestLogDTO;
import com.ratelimiter.model.User;
import com.ratelimiter.repository.UserRepository;
import com.ratelimiter.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponseDTO> getAnalytics() {
        AnalyticsResponseDTO analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<RequestLogDTO>> getLogs() {
        List<RequestLogDTO> logs = analyticsService.getRecentLogs();
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> body) {
        String name = (String) body.getOrDefault("name", "Unnamed User");
        String planType = (String) body.getOrDefault("plan_type", "FREE");
        Integer maxPerMinute = (Integer) body.getOrDefault("max_requests_per_minute", 60);

        String apiKey = UUID.randomUUID().toString();

        User user = User.builder()
                .name(name)
                .planType(planType)
                .apiKey(apiKey)
                .maxRequestsPerMinute(maxPerMinute)
                .build();

        userRepository.save(user);

        log.info("Created new user name={} planType={} apiKey={}", name, planType, apiKey);

        Map<String, Object> response = Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "plan_type", user.getPlanType(),
                "api_key", user.getApiKey(),
                "max_requests_per_minute", user.getMaxRequestsPerMinute()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

