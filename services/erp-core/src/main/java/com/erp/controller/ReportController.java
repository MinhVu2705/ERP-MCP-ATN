package com.erp.controller;

import com.erp.entity.Report;
import com.erp.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    
    @Autowired
    private ReportRepository reportRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllReports(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status
    ) {
        try {
            List<Report> reports;
            
            if (type != null && !type.isEmpty()) {
                reports = reportRepository.findByType(type);
            } else if (status != null && !status.isEmpty()) {
                reports = reportRepository.findByStatus(status);
            } else {
                reports = reportRepository.findAll();
            }
            
            // Sort by created date descending
            reports.sort((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()));
            
            Map<String, Object> response = new HashMap<>();
            response.put("reports", reports);
            response.put("total", reports.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        Optional<Report> report = reportRepository.findById(id);
        if (report.isPresent()) {
            return ResponseEntity.ok(report.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Report not found"));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentReports(@RequestParam(defaultValue = "30") int days) {
        try {
            LocalDateTime since = LocalDateTime.now().minusDays(days);
            List<Report> recentReports = reportRepository.findRecentReports(since);
            
            return ResponseEntity.ok(Map.of("reports", recentReports));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/types")
    public ResponseEntity<?> getReportTypes() {
        try {
            List<Report> allReports = reportRepository.findAll();
            Map<String, Long> typeCounts = new HashMap<>();
            
            for (Report report : allReports) {
                String type = report.getType();
                typeCounts.put(type, typeCounts.getOrDefault(type, 0L) + 1);
            }
            
            return ResponseEntity.ok(Map.of("types", typeCounts));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Report report) {
        try {
            // Set default status if not provided
            if (report.getStatus() == null || report.getStatus().isEmpty()) {
                report.setStatus("processing");
            }
            
            Report savedReport = reportRepository.save(report);
            
            // Simulate report generation (in real scenario, this would be async)
            // For now, just mark as completed after 2 seconds
            savedReport.setStatus("completed");
            reportRepository.save(savedReport);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> updateReport(@PathVariable Long id, @RequestBody Report reportDetails) {
        try {
            Optional<Report> optionalReport = reportRepository.findById(id);
            if (optionalReport.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Report not found"));
            }
            
            Report report = optionalReport.get();
            if (reportDetails.getName() != null) report.setName(reportDetails.getName());
            if (reportDetails.getStatus() != null) report.setStatus(reportDetails.getStatus());
            if (reportDetails.getFileUrl() != null) report.setFileUrl(reportDetails.getFileUrl());
            
            Report updatedReport = reportRepository.save(report);
            return ResponseEntity.ok(updatedReport);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            if (!reportRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Report not found"));
            }
            
            reportRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
