package com.ratelimiter.repository;

import com.ratelimiter.model.RequestLog;
import com.ratelimiter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {

    List<RequestLog> findTop100ByOrderByTimestampDesc();

    long countByStatus(String status);

    long countByUser(User user);

    @Query("""
            SELECT rl.user.id, COUNT(rl)
            FROM RequestLog rl
            GROUP BY rl.user.id
            ORDER BY COUNT(rl) DESC
            """)
    List<Object[]> findTopUsersByUsage();
}

