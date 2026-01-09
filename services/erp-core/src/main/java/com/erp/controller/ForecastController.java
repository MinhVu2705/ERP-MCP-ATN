package com.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "*")
public class ForecastController {
    
    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getForecastInsights() {
        Map<String, Object> insights = new HashMap<>();
        
        // Q1 2025 Forecast
        Map<String, Object> q1Forecast = new HashMap<>();
        q1Forecast.put("period", "Q1 2025");
        q1Forecast.put("growthPercent", 18.5);
        q1Forecast.put("status", "positive");
        q1Forecast.put("label", "Tích Cực");
        q1Forecast.put("message", "Tăng trưởng mạnh dự kiến trong quý tới");
        
        // Peak Season
        Map<String, Object> peakSeason = new HashMap<>();
        peakSeason.put("name", "Tết 2025");
        peakSeason.put("period", "Tháng 1-2 năm 2025");
        peakSeason.put("expectedGrowth", 35.0);
        peakSeason.put("status", "trend");
        peakSeason.put("label", "Xu Hướng");
        peakSeason.put("message", "Doanh số dự kiến tăng 35% trong giai đoạn này");
        
        // Inventory Warning
        Map<String, Object> inventoryWarning = new HashMap<>();
        inventoryWarning.put("type", "Tồn Kho");
        inventoryWarning.put("changePercent", -12.0);
        inventoryWarning.put("status", "warning");
        inventoryWarning.put("label", "Cảnh Báo");
        inventoryWarning.put("message", "Nguy cơ thiếu hàng cho 3 sản phẩm chủ lực");
        
        insights.put("q1Forecast", q1Forecast);
        insights.put("peakSeason", peakSeason);
        insights.put("inventoryWarning", inventoryWarning);
        
        return ResponseEntity.ok(insights);
    }
    
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueForecast() {
        List<Map<String, Object>> forecastData = new ArrayList<>();
        
        // Historical data (last 6 months)
        forecastData.add(Map.of("month", "T7/24", "actual", 85, "forecast", 0, "type", "actual"));
        forecastData.add(Map.of("month", "T8/24", "actual", 90, "forecast", 0, "type", "actual"));
        forecastData.add(Map.of("month", "T9/24", "actual", 88, "forecast", 0, "type", "actual"));
        forecastData.add(Map.of("month", "T10/24", "actual", 95, "forecast", 0, "type", "actual"));
        forecastData.add(Map.of("month", "T11/24", "actual", 92, "forecast", 0, "type", "actual"));
        forecastData.add(Map.of("month", "T12/24", "actual", 100, "forecast", 0, "type", "actual"));
        
        // Forecast data (next 6 months)
        forecastData.add(Map.of("month", "T1/25", "actual", 0, "forecast", 105, "type", "forecast"));
        forecastData.add(Map.of("month", "T2/25", "actual", 0, "forecast", 115, "type", "forecast"));
        forecastData.add(Map.of("month", "T3/25", "actual", 0, "forecast", 110, "type", "forecast"));
        forecastData.add(Map.of("month", "T4/25", "actual", 0, "forecast", 108, "type", "forecast"));
        forecastData.add(Map.of("month", "T5/25", "actual", 0, "forecast", 112, "type", "forecast"));
        forecastData.add(Map.of("month", "T6/25", "actual", 0, "forecast", 118, "type", "forecast"));
        
        return ResponseEntity.ok(Map.of("data", forecastData));
    }
    
    @GetMapping("/targets")
    public ResponseEntity<?> getTargets() {
        List<Map<String, Object>> targets = new ArrayList<>();
        
        targets.add(Map.of(
            "target", "Doanh thu Q1 2025",
            "expected", "180M VND",
            "probability", 85,
            "status", "high"
        ));
        
        targets.add(Map.of(
            "target", "Khách hàng mới",
            "expected", "450 KH",
            "probability", 78,
            "status", "high"
        ));
        
        targets.add(Map.of(
            "target", "Tỷ lệ giữ chân",
            "expected", "92%",
            "probability", 65,
            "status", "medium"
        ));
        
        targets.add(Map.of(
            "target", "Mở rộng khu vực",
            "expected", "2 chi nhánh",
            "probability", 45,
            "status", "low"
        ));
        
        return ResponseEntity.ok(Map.of("targets", targets));
    }
    
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations() {
        List<Map<String, Object>> recommendations = new ArrayList<>();
        
        recommendations.add(Map.of(
            "title", "Tăng tồn kho",
            "description", "Nhập thêm 200 đơn vị iPhone 15 Pro trước Tết",
            "priority", "high"
        ));
        
        recommendations.add(Map.of(
            "title", "Khuyến mãi",
            "description", "Chạy campaign giảm giá 15% cho Laptop trong T1",
            "priority", "medium"
        ));
        
        recommendations.add(Map.of(
            "title", "Nhân sự",
            "description", "Tuyển thêm 5 nhân viên bán hàng part-time",
            "priority", "high"
        ));
        
        recommendations.add(Map.of(
            "title", "Marketing",
            "description", "Tăng ngân sách Facebook Ads lên 30M/tháng",
            "priority", "medium"
        ));
        
        recommendations.add(Map.of(
            "title", "Đối tác",
            "description", "Mở rộng hợp tác với 3 nhà cung cấp mới",
            "priority", "low"
        ));
        
        return ResponseEntity.ok(Map.of("recommendations", recommendations));
    }
}
