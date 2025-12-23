package com.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Dashboard Controller
 * 
 * Use Case 6: Dashboard tổng hợp điều hành
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @GetMapping("/kpi")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        Map<String, Object> kpis = new HashMap<>();
        
        // Revenue KPI
        Map<String, Object> revenue = new HashMap<>();
        revenue.put("value", 2.1);
        revenue.put("change", 10.0);
        revenue.put("trend", "up");
        kpis.put("revenue", revenue);
        
        // Profit KPI
        Map<String, Object> profit = new HashMap<>();
        profit.put("value", 0.45);
        profit.put("change", 15.0);
        profit.put("trend", "up");
        kpis.put("profit", profit);
        
        // Orders KPI
        Map<String, Object> orders = new HashMap<>();
        orders.put("value", 1234);
        orders.put("change", -5.0);
        orders.put("trend", "down");
        kpis.put("orders", orders);
        
        // Inventory KPI
        Map<String, Object> inventory = new HashMap<>();
        inventory.put("value", 5678);
        inventory.put("change", 2.0);
        inventory.put("trend", "up");
        kpis.put("inventory", inventory);
        
        return ResponseEntity.ok(kpis);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        Map<String, Object> act1 = new HashMap<>();
        act1.put("id", 1);
        act1.put("action", "Đơn hàng mới #1234");
        act1.put("user", "Nguyễn Văn A");
        act1.put("timestamp", new Date(System.currentTimeMillis() - 300000));
        activities.add(act1);
        
        Map<String, Object> act2 = new HashMap<>();
        act2.put("id", 2);
        act2.put("action", "Cập nhật báo giá sản phẩm B");
        act2.put("user", "Trần Thị B");
        act2.put("timestamp", new Date(System.currentTimeMillis() - 900000));
        activities.add(act2);
        
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        
        Map<String, Object> alert1 = new HashMap<>();
        alert1.put("id", 1);
        alert1.put("type", "warning");
        alert1.put("message", "Sản phẩm A sắp hết hàng");
        alert1.put("timestamp", new Date());
        alerts.add(alert1);
        
        return ResponseEntity.ok(alerts);
    }
}
