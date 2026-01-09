package com.erp.controller;

import com.erp.entity.Product;
import com.erp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {
        try {
            List<Product> products;
            
            if (category != null && !category.isEmpty()) {
                products = productRepository.findByCategory(category);
            } else if (status != null && !status.isEmpty()) {
                products = productRepository.findByStatus(status);
            } else {
                products = productRepository.findAll();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", products);
            response.put("total", products.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Product not found"));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        try {
            long totalProducts = productRepository.count();
            List<Product> activeProducts = productRepository.findByStatus("active");
            List<Product> lowStockProducts = productRepository.findLowStockProducts();
            List<Product> outOfStockProducts = productRepository.findOutOfStockProducts();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", totalProducts);
            stats.put("active", activeProducts.size());
            stats.put("lowStock", lowStockProducts.size());
            stats.put("outOfStock", outOfStockProducts.size());
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/top-selling")
    public ResponseEntity<?> getTopSellingProducts(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Product> topProducts = productRepository.findTopSellingProducts();
            List<Product> limitedProducts = topProducts.stream()
                    .limit(limit)
                    .toList();
            
            return ResponseEntity.ok(Map.of("products", limitedProducts));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            List<Product> allProducts = productRepository.findAll();
            Map<String, Long> categoryCounts = new HashMap<>();
            
            for (Product product : allProducts) {
                String category = product.getCategory();
                categoryCounts.put(category, categoryCounts.getOrDefault(category, 0L) + 1);
            }
            
            List<Map<String, Object>> categories = new ArrayList<>();
            for (Map.Entry<String, Long> entry : categoryCounts.entrySet()) {
                Map<String, Object> categoryInfo = new HashMap<>();
                categoryInfo.put("name", entry.getKey());
                categoryInfo.put("count", entry.getValue());
                categories.add(categoryInfo);
            }
            
            return ResponseEntity.ok(Map.of("categories", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Optional<Product> optionalProduct = productRepository.findById(id);
            if (optionalProduct.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found"));
            }
            
            Product product = optionalProduct.get();
            if (productDetails.getName() != null) product.setName(productDetails.getName());
            if (productDetails.getCategory() != null) product.setCategory(productDetails.getCategory());
            if (productDetails.getPrice() != null) product.setPrice(productDetails.getPrice());
            if (productDetails.getStock() != null) product.setStock(productDetails.getStock());
            
            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            if (!productRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product not found"));
            }
            
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
