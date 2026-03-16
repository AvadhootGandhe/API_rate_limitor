package com.ratelimiter.middleware;

import com.ratelimiter.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    public static final String API_KEY_HEADER = "X-API-KEY";

    private final RateLimiterService rateLimiterService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String apiKey = request.getHeader(API_KEY_HEADER);
        String path = request.getRequestURI();

        // Allow user creation endpoint without API key (bootstrap)
        if ("/api/users".equals(path) && "POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Missing API key for path={}", path);
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Missing X-API-KEY header");
            return false;
        }

        RateLimiterService.RateLimitResult result = rateLimiterService.processRequest(apiKey, path);
        if (!result.isAllowed()) {
            if (result.getUser() == null) {
                response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid API key");
            } else {
                response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(), "Rate limit exceeded");
            }
            return false;
        }

        return true;
    }
}

