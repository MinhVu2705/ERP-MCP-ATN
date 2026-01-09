package com.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Revenue Management Controller
 * 
 * Use Case 1: Quản lý doanh thu & Báo cáo tài chính
 */
@RestController
@RequestMapping("/api/revenue")
@CrossOrigin(origins = "*")
public class RevenueController {

    @GetMapping("/september")
    public ResponseEntity<Map<String, Object>> getSeptemberRevenue() {
        Map<String, Object> response = new HashMap<>();
        response.put("revenue", 2.1);
        response.put("growth", 10.0);
        response.put("month", "September");
        response.put("year", 2024);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue() {
        List<Map<String, Object>> data = new ArrayList<>();
        
        String[] months = {"T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9"};
        double[] revenues = {1.8, 1.9, 2.1, 2.0, 2.3, 2.5, 2.4, 2.6, 2.1};
        
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", months[i]);
            monthData.put("revenue", revenues[i]);
            data.add(monthData);
        }
        
        return ResponseEntity.ok(data);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getRevenueSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", 18.7);
        summary.put("totalExpenses", 12.4);
        summary.put("profit", 6.3);
        summary.put("profitMargin", 33.7);
        summary.put("growthRate", 8.5);
        
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getProductRevenue(@PathVariable String productId) {
        Map<String, Object> response = new HashMap<>();
        
        if ("A".equals(productId)) {
            response.put("productId", "A");
            response.put("productName", "Sản phẩm A");
            response.put("revenue", 0.85);
            response.put("growth", 12.0);
            response.put("month", "September");
        } else {
            response.put("productId", productId);
            response.put("productName", "Sản phẩm " + productId);
            response.put("revenue", 0.5);
            response.put("growth", 5.0);
        }
        
        return ResponseEntity.ok(response);
    }
}
