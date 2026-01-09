package com.erp.controller;

import com.erp.entity.PurchaseOrder;
import com.erp.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {
    
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;
    
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus) {
        
        List<PurchaseOrder> orders;
        if (status != null && !status.isEmpty()) {
            orders = purchaseOrderRepository.findByStatus(status);
        } else if (paymentStatus != null && !paymentStatus.isEmpty()) {
            orders = purchaseOrderRepository.findByPaymentStatus(paymentStatus);
        } else {
            orders = purchaseOrderRepository.findAll();
        }
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<PurchaseOrder> getOrderById(@PathVariable Long id) {
        return purchaseOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", purchaseOrderRepository.count());
        stats.put("draft", purchaseOrderRepository.countByStatus("draft"));
        stats.put("sent", purchaseOrderRepository.countByStatus("sent"));
        stats.put("confirmed", purchaseOrderRepository.countByStatus("confirmed"));
        stats.put("received", purchaseOrderRepository.countByStatus("received"));
        stats.put("totalPurchased", purchaseOrderRepository.getTotalPurchased());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<PurchaseOrder>> getPendingOrders() {
        return ResponseEntity.ok(purchaseOrderRepository.findPendingOrders(LocalDate.now()));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<PurchaseOrder>> getRecentOrders(@RequestParam(defaultValue = "30") int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return ResponseEntity.ok(purchaseOrderRepository.findRecentOrders(startDate));
    }
    
    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseOrder>> getOrdersBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(purchaseOrderRepository.findBySupplierId(supplierId));
    }
    
    @PostMapping
    public ResponseEntity<PurchaseOrder> createOrder(@RequestBody PurchaseOrder order) {
        order.setOrderDate(LocalDate.now());
        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<PurchaseOrder> updateOrder(@PathVariable Long id, @RequestBody PurchaseOrder orderDetails) {
        return purchaseOrderRepository.findById(id)
                .map(order -> {
                    order.setStatus(orderDetails.getStatus());
                    order.setPaymentStatus(orderDetails.getPaymentStatus());
                    order.setPaymentTerms(orderDetails.getPaymentTerms());
                    order.setExpectedDate(orderDetails.getExpectedDate());
                    order.setReceivedDate(orderDetails.getReceivedDate());
                    order.setNotes(orderDetails.getNotes());
                    return ResponseEntity.ok(purchaseOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (purchaseOrderRepository.existsById(id)) {
            purchaseOrderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
