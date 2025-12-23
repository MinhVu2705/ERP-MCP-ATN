package com.erp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Inventory Management Controller
 */
@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @GetMapping("/stock")
    public ResponseEntity<Map<String, Object>> getInventoryStock() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalItems", 5678);
        response.put("lowStockItems", 15);
        response.put("outOfStockItems", 3);
        response.put("value", 125.6);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Map<String, Object>> getProductStock(@PathVariable String productId) {
        Map<String, Object> response = new HashMap<>();
        response.put("productId", productId);
        response.put("productName", "Sản phẩm " + productId);
        response.put("quantity", 150);
        response.put("minQuantity", 50);
        response.put("status", "in_stock");
        response.put("lastUpdated", new Date());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Map<String, Object>>> getLowStockItems() {
        List<Map<String, Object>> items = new ArrayList<>();
        
        Map<String, Object> item1 = new HashMap<>();
        item1.put("productId", "A");
        item1.put("productName", "Sản phẩm A");
        item1.put("quantity", 45);
        item1.put("minQuantity", 50);
        item1.put("recommendedOrder", 500);
        items.add(item1);
        
        return ResponseEntity.ok(items);
    }
}
