package com.ratelimiter.service;

import com.ratelimiter.model.RequestLog;
import com.ratelimiter.model.User;
import com.ratelimiter.repository.RequestLogRepository;
import com.ratelimiter.repository.UserRepository;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimiterService {

    private final UserRepository userRepository;
    private final RequestLogRepository requestLogRepository;

    private final Map<Long, Bucket> bucketsByUserId = new ConcurrentHashMap<>();

    @Value
    public static class RateLimitResult {
        boolean allowed;
        User user;
    }

    public RateLimitResult processRequest(String apiKey, String endpoint) {
        Optional<User> userOpt = userRepository.findByApiKey(apiKey);
        if (userOpt.isEmpty()) {
            log.warn("Invalid API key attempted: {}", apiKey);
            return new RateLimitResult(false, null);
        }

        User user = userOpt.get();
        Bucket bucket = bucketsByUserId.computeIfAbsent(user.getId(), id -> createBucketForUser(user));

        boolean allowed = bucket.tryConsume(1);

        String status = allowed ? "allowed" : "blocked";
        logRequest(user, endpoint, status);

        log.debug("Rate limit check for user={} endpoint={} status={}", user.getApiKey(), endpoint, status);

        return new RateLimitResult(allowed, user);
    }

    private Bucket createBucketForUser(User user) {
        int capacityPerMinute = Optional.ofNullable(user.getMaxRequestsPerMinute()).orElse(60);
        Bandwidth limit = Bandwidth.classic(capacityPerMinute, Refill.greedy(capacityPerMinute, Duration.ofMinutes(1)));
        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }

    private void logRequest(User user, String endpoint, String status) {
        RequestLog logEntry = RequestLog.builder()
                .user(user)
                .endpoint(endpoint)
                .timestamp(Instant.now())
                .status(status)
                .build();
        requestLogRepository.save(logEntry);
    }
}

