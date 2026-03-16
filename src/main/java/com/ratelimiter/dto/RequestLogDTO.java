package com.ratelimiter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestLogDTO {

    private Long id;
    private String userName;
    private String apiKey;
    private String endpoint;
    private Instant timestamp;
    private String status;
}

