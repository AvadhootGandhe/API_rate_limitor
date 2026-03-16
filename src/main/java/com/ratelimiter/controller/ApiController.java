package com.ratelimiter.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Slf4j
public class ApiController {

    @GetMapping("/data")
    public ResponseEntity<Map<String, String>> getData() {
        log.info("Protected endpoint /api/data accessed");
        return ResponseEntity.ok(Map.of("message", "data fetched successfully"));
    }
}

