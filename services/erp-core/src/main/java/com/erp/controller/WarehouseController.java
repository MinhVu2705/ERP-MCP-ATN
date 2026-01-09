package com.erp.controller;

import com.erp.entity.Warehouse;
import com.erp.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
public class WarehouseController {
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @GetMapping
    public ResponseEntity<List<Warehouse>> getAllWarehouses(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        
        List<Warehouse> warehouses;
        if (status != null && !status.isEmpty()) {
            warehouses = warehouseRepository.findByStatus(status);
        } else if (type != null && !type.isEmpty()) {
            warehouses = warehouseRepository.findByType(type);
        } else {
            warehouses = warehouseRepository.findAll();
        }
        return ResponseEntity.ok(warehouses);
    }
    
    @SuppressWarnings("null")
    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id) {
        return warehouseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", warehouseRepository.count());
        stats.put("active", warehouseRepository.countByStatus("active"));
        stats.put("inactive", warehouseRepository.countByStatus("inactive"));
        stats.put("totalStock", warehouseRepository.getTotalStock());
        stats.put("totalCapacity", warehouseRepository.getTotalCapacity());
        
        Long totalStock = warehouseRepository.getTotalStock();
        Long totalCapacity = warehouseRepository.getTotalCapacity();
        if (totalCapacity != null && totalCapacity > 0 && totalStock != null) {
            stats.put("utilizationPercent", (totalStock * 100.0) / totalCapacity);
        } else {
            stats.put("utilizationPercent", 0);
        }
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Warehouse>> getActiveWarehouses() {
        return ResponseEntity.ok(warehouseRepository.findActiveWarehouses());
    }
    
    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody Warehouse warehouse) {
        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return ResponseEntity.ok(savedWarehouse);
    }
    
    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<Warehouse> updateWarehouse(@PathVariable Long id, @RequestBody Warehouse warehouseDetails) {
        return warehouseRepository.findById(id)
                .map(warehouse -> {
                    warehouse.setName(warehouseDetails.getName());
                    warehouse.setLocation(warehouseDetails.getLocation());
                    warehouse.setCity(warehouseDetails.getCity());
                    warehouse.setManager(warehouseDetails.getManager());
                    warehouse.setPhone(warehouseDetails.getPhone());
                    warehouse.setEmail(warehouseDetails.getEmail());
                    warehouse.setCapacity(warehouseDetails.getCapacity());
                    warehouse.setCurrentStock(warehouseDetails.getCurrentStock());
                    warehouse.setType(warehouseDetails.getType());
                    warehouse.setStatus(warehouseDetails.getStatus());
                    warehouse.setNotes(warehouseDetails.getNotes());
                    return ResponseEntity.ok(warehouseRepository.save(warehouse));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Long id) {
        if (warehouseRepository.existsById(id)) {
            warehouseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
