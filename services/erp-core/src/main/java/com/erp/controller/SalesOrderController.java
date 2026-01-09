package com.erp.controller;

import com.erp.entity.SalesOrder;
import com.erp.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales-orders")
@CrossOrigin(origins = "*")
public class SalesOrderController {
    
    @Autowired
    private SalesOrderRepository salesOrderRepository;
    
    @GetMapping
    public ResponseEntity<List<SalesOrder>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus) {
        
        List<SalesOrder> orders;
        if (status != null && !status.isEmpty()) {
            orders = salesOrderRepository.findByStatus(status);
        } else if (paymentStatus != null && !paymentStatus.isEmpty()) {
            orders = salesOrderRepository.findByPaymentStatus(paymentStatus);
        } else {
            orders = salesOrderRepository.findAll();
        }
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<SalesOrder> getOrderById(@PathVariable Long id) {
        return salesOrderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", salesOrderRepository.count());
        stats.put("pending", salesOrderRepository.countByStatus("pending"));
        stats.put("confirmed", salesOrderRepository.countByStatus("confirmed"));
        stats.put("delivered", salesOrderRepository.countByStatus("delivered"));
        stats.put("cancelled", salesOrderRepository.countByStatus("cancelled"));
        stats.put("totalRevenue", salesOrderRepository.getTotalRevenue());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<SalesOrder>> getRecentOrders(@RequestParam(defaultValue = "30") int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return ResponseEntity.ok(salesOrderRepository.findRecentOrders(startDate));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SalesOrder>> getOrdersByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(salesOrderRepository.findByCustomerId(customerId));
    }
    
    @PostMapping
    public ResponseEntity<SalesOrder> createOrder(@RequestBody SalesOrder order) {
        order.setOrderDate(LocalDateTime.now());
        SalesOrder savedOrder = salesOrderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<SalesOrder> updateOrder(@PathVariable Long id, @RequestBody SalesOrder orderDetails) {
        return salesOrderRepository.findById(id)
                .map(order -> {
                    order.setStatus(orderDetails.getStatus());
                    order.setPaymentStatus(orderDetails.getPaymentStatus());
                    order.setPaymentMethod(orderDetails.getPaymentMethod());
                    order.setShippingAddress(orderDetails.getShippingAddress());
                    order.setNotes(orderDetails.getNotes());
                    order.setDiscount(orderDetails.getDiscount());
                    order.setTax(orderDetails.getTax());
                    order.setGrandTotal(orderDetails.getGrandTotal());
                    return ResponseEntity.ok(salesOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (salesOrderRepository.existsById(id)) {
            salesOrderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
