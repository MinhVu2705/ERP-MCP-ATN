package com.erp.controller;

import com.erp.entity.Customer;
import com.erp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCustomers(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String location
    ) {
        try {
            List<Customer> customers;
            
            if (level != null && !level.isEmpty()) {
                customers = customerRepository.findByLevel(level);
            } else if (location != null && !location.isEmpty()) {
                customers = customerRepository.findByLocation(location);
            } else {
                customers = customerRepository.findAll();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("customers", customers);
            response.put("total", customers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerRepository.findById(id);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Customer not found"));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCustomerStats() {
        try {
            long totalCustomers = customerRepository.count();
            List<Customer> vipCustomers = customerRepository.findVIPCustomers();
            List<Customer> diamondCustomers = customerRepository.findByLevel("diamond");
            List<Customer> goldCustomers = customerRepository.findByLevel("gold");
            List<Customer> newCustomers = customerRepository.findByLevel("new");
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", totalCustomers);
            stats.put("vip", vipCustomers.size());
            stats.put("diamond", diamondCustomers.size());
            stats.put("gold", goldCustomers.size());
            stats.put("new", newCustomers.size());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/top")
    public ResponseEntity<?> getTopCustomers(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Customer> topCustomers = customerRepository.findTopCustomers();
            List<Customer> limitedCustomers = topCustomers.stream()
                    .limit(limit)
                    .toList();
            
            return ResponseEntity.ok(Map.of("customers", limitedCustomers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/vip")
    public ResponseEntity<?> getVIPCustomers() {
        try {
            List<Customer> vipCustomers = customerRepository.findVIPCustomers();
            return ResponseEntity.ok(Map.of("customers", vipCustomers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/segments")
    public ResponseEntity<?> getCustomerSegments() {
        try {
            List<Customer> allCustomers = customerRepository.findAll();
            
            long diamondCount = allCustomers.stream().filter(c -> "diamond".equals(c.getLevel())).count();
            long goldCount = allCustomers.stream().filter(c -> "gold".equals(c.getLevel())).count();
            long silverCount = allCustomers.stream().filter(c -> "silver".equals(c.getLevel())).count();
            long newCount = allCustomers.stream().filter(c -> "new".equals(c.getLevel())).count();
            
            List<Map<String, Object>> segments = new ArrayList<>();
            
            segments.add(Map.of(
                "segment", "Diamond",
                "count", diamondCount,
                "percent", allCustomers.isEmpty() ? 0 : (diamondCount * 100 / allCustomers.size())
            ));
            
            segments.add(Map.of(
                "segment", "Gold",
                "count", goldCount,
                "percent", allCustomers.isEmpty() ? 0 : (goldCount * 100 / allCustomers.size())
            ));
            
            segments.add(Map.of(
                "segment", "Silver",
                "count", silverCount,
                "percent", allCustomers.isEmpty() ? 0 : (silverCount * 100 / allCustomers.size())
            ));
            
            segments.add(Map.of(
                "segment", "New",
                "count", newCount,
                "percent", allCustomers.isEmpty() ? 0 : (newCount * 100 / allCustomers.size())
            ));
            
            return ResponseEntity.ok(Map.of("segments", segments));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        try {
            Customer savedCustomer = customerRepository.save(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        try {
            Optional<Customer> optionalCustomer = customerRepository.findById(id);
            if (optionalCustomer.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Customer not found"));
            }
            
            Customer customer = optionalCustomer.get();
            if (customerDetails.getName() != null) customer.setName(customerDetails.getName());
            if (customerDetails.getEmail() != null) customer.setEmail(customerDetails.getEmail());
            if (customerDetails.getPhone() != null) customer.setPhone(customerDetails.getPhone());
            if (customerDetails.getLocation() != null) customer.setLocation(customerDetails.getLocation());
            
            Customer updatedCustomer = customerRepository.save(customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            if (!customerRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Customer not found"));
            }
            
            customerRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
