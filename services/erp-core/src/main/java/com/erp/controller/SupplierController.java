package com.erp.controller;

import com.erp.entity.Supplier;
import com.erp.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {
    
    @Autowired
    private SupplierRepository supplierRepository;
    
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String rating) {
        
        List<Supplier> suppliers;
        if (status != null && !status.isEmpty()) {
            suppliers = supplierRepository.findByStatus(status);
        } else if (rating != null && !rating.isEmpty()) {
            suppliers = supplierRepository.findByRating(rating);
        } else {
            suppliers = supplierRepository.findAll();
        }
        return ResponseEntity.ok(suppliers);
    }
    
    @SuppressWarnings("null")
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return supplierRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", supplierRepository.count());
        stats.put("active", supplierRepository.countByStatus("active"));
        stats.put("inactive", supplierRepository.countByStatus("inactive"));
        stats.put("blocked", supplierRepository.countByStatus("blocked"));
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/top")
    public ResponseEntity<List<Supplier>> getTopSuppliers(@RequestParam(defaultValue = "10") int limit) {
        List<Supplier> suppliers = supplierRepository.findTopSuppliers();
        return ResponseEntity.ok(suppliers.stream().limit(limit).toList());
    }
    
    @GetMapping("/preferred")
    public ResponseEntity<List<Supplier>> getPreferredSuppliers() {
        return ResponseEntity.ok(supplierRepository.findPreferredSuppliers());
    }
    
    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        Supplier savedSupplier = supplierRepository.save(supplier);
        return ResponseEntity.ok(savedSupplier);
    }
    
    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplierDetails) {
        return supplierRepository.findById(id)
                .map(supplier -> {
                    supplier.setName(supplierDetails.getName());
                    supplier.setEmail(supplierDetails.getEmail());
                    supplier.setPhone(supplierDetails.getPhone());
                    supplier.setAddress(supplierDetails.getAddress());
                    supplier.setCity(supplierDetails.getCity());
                    supplier.setCountry(supplierDetails.getCountry());
                    supplier.setContactPerson(supplierDetails.getContactPerson());
                    supplier.setRating(supplierDetails.getRating());
                    supplier.setStatus(supplierDetails.getStatus());
                    supplier.setNotes(supplierDetails.getNotes());
                    return ResponseEntity.ok(supplierRepository.save(supplier));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (supplierRepository.existsById(id)) {
            supplierRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
