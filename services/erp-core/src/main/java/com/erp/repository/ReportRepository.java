package com.erp.repository;

import com.erp.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByType(String type);
    
    List<Report> findByStatus(String status);
    
    List<Report> findByCreatedBy(String createdBy);
    
    @Query("SELECT r FROM Report r WHERE r.createdAt >= ?1 ORDER BY r.createdAt DESC")
    List<Report> findRecentReports(LocalDateTime since);
}
