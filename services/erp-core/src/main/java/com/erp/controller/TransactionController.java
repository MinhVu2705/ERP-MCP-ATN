package com.erp.controller;

import com.erp.entity.Transaction;
import com.erp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        try {
            List<Transaction> transactions = transactionRepository.findAll();
            
            // Filter by date range if provided
            if (startDate != null && endDate != null) {
                transactions = transactions.stream()
                    .filter(t -> !t.getTransactionDate().isBefore(startDate) && !t.getTransactionDate().isAfter(endDate))
                    .collect(Collectors.toList());
            }
            
            // Filter by department if provided
            if (department != null && !department.isEmpty()) {
                transactions = transactions.stream()
                    .filter(t -> department.equalsIgnoreCase(t.getDepartment()))
                    .collect(Collectors.toList());
            }
            
            Map<String, Object> analytics = new HashMap<>();
            
            // Analyze based on type
            if ("top_products".equalsIgnoreCase(type)) {
                analytics = analyzeTopProducts(transactions);
            } else if ("department_performance".equalsIgnoreCase(type)) {
                analytics = analyzeDepartmentPerformance(transactions);
            } else if ("monthly_trend".equalsIgnoreCase(type)) {
                analytics = analyzeMonthlyTrend(transactions);
            } else if ("product_category".equalsIgnoreCase(type)) {
                analytics = analyzeProductCategory(transactions);
            } else {
                // Default: comprehensive analytics
                analytics = analyzeComprehensive(transactions);
            }
            
            return ResponseEntity.ok(analytics);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
    
    private Map<String, Object> analyzeTopProducts(List<Transaction> transactions) {
        Map<String, Double> productRevenue = transactions.stream()
            .collect(Collectors.groupingBy(
                Transaction::getProduct,
                Collectors.summingDouble(t -> t.getRevenue().doubleValue())
            ));
        
        List<Map<String, Object>> topProducts = productRevenue.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .limit(10)
            .map(entry -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", entry.getKey());
                map.put("value", entry.getValue());
                map.put("change", (Math.random() - 0.5) * 40);
                return map;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("type", "top_products");
        result.put("data", topProducts);
        result.put("total", productRevenue.values().stream().mapToDouble(Double::doubleValue).sum());
        
        return result;
    }
    
    private Map<String, Object> analyzeDepartmentPerformance(List<Transaction> transactions) {
        Map<String, Map<String, Double>> deptMetrics = new HashMap<>();
        
        transactions.forEach(t -> {
            String dept = t.getDepartment();
            deptMetrics.putIfAbsent(dept, new HashMap<>());
            Map<String, Double> metrics = deptMetrics.get(dept);
            
            metrics.put("revenue", metrics.getOrDefault("revenue", 0.0) + t.getRevenue().doubleValue());
            metrics.put("profit", metrics.getOrDefault("profit", 0.0) + t.getProfit().doubleValue());
            metrics.put("cost", metrics.getOrDefault("cost", 0.0) + t.getCost().doubleValue());
            metrics.put("count", metrics.getOrDefault("count", 0.0) + 1);
        });
        
        List<Map<String, Object>> departments = deptMetrics.entrySet().stream()
            .map(entry -> {
                Map<String, Object> dept = new HashMap<>();
                dept.put("name", entry.getKey());
                dept.put("revenue", entry.getValue().get("revenue"));
                dept.put("profit", entry.getValue().get("profit"));
                dept.put("cost", entry.getValue().get("cost"));
                dept.put("transactions", entry.getValue().get("count").intValue());
                dept.put("profitMargin", 
                    (entry.getValue().get("profit") / entry.getValue().get("revenue") * 100));
                return dept;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("revenue"), (Double) a.get("revenue")))
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("type", "department_performance");
        result.put("data", departments);
        
        return result;
    }
    
    private Map<String, Object> analyzeMonthlyTrend(List<Transaction> transactions) {
        Map<String, Map<String, Double>> monthlyData = new TreeMap<>();
        
        transactions.forEach(t -> {
            String month = t.getTransactionDate().toString().substring(0, 7); // YYYY-MM
            monthlyData.putIfAbsent(month, new HashMap<>());
            Map<String, Double> metrics = monthlyData.get(month);
            
            metrics.put("revenue", metrics.getOrDefault("revenue", 0.0) + t.getRevenue().doubleValue());
            metrics.put("profit", metrics.getOrDefault("profit", 0.0) + t.getProfit().doubleValue());
            metrics.put("cost", metrics.getOrDefault("cost", 0.0) + t.getCost().doubleValue());
        });
        
        List<Map<String, Object>> trend = monthlyData.entrySet().stream()
            .map(entry -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", entry.getKey());
                map.put("revenue", entry.getValue().get("revenue"));
                map.put("profit", entry.getValue().get("profit"));
                map.put("cost", entry.getValue().get("cost"));
                return map;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("type", "monthly_trend");
        result.put("data", trend);
        
        return result;
    }
    
    private Map<String, Object> analyzeProductCategory(List<Transaction> transactions) {
        // Group by first word of product (category)
        Map<String, Double> categoryRevenue = transactions.stream()
            .collect(Collectors.groupingBy(
                t -> t.getProduct().split(" ")[0], // First word as category
                Collectors.summingDouble(t -> t.getRevenue().doubleValue())
            ));
        
        List<Map<String, Object>> categories = categoryRevenue.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .map(entry -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", entry.getKey());
                map.put("value", entry.getValue());
                return map;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("type", "product_category");
        result.put("data", categories);
        
        return result;
    }
    
    private Map<String, Object> analyzeComprehensive(List<Transaction> transactions) {
        Map<String, Object> result = new HashMap<>();
        
        // Overall metrics
        double totalRevenue = transactions.stream().mapToDouble(t -> t.getRevenue().doubleValue()).sum();
        double totalProfit = transactions.stream().mapToDouble(t -> t.getProfit().doubleValue()).sum();
        double totalCost = transactions.stream().mapToDouble(t -> t.getCost().doubleValue()).sum();
        
        result.put("totalRevenue", totalRevenue);
        result.put("totalProfit", totalProfit);
        result.put("totalCost", totalCost);
        result.put("profitMargin", (totalProfit / totalRevenue * 100));
        result.put("transactionCount", transactions.size());
        
        // Top products
        result.put("topProducts", analyzeTopProducts(transactions).get("data"));
        
        // Department breakdown
        result.put("departments", analyzeDepartmentPerformance(transactions).get("data"));
        
        return result;
    }
}
