package com.erp.repository;

import com.erp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByStatus(String status);
    
    @Query("SELECT p FROM Product p ORDER BY p.soldCount DESC")
    List<Product> findTopSellingProducts();
    
    @Query("SELECT p FROM Product p WHERE p.stock < 10 AND p.stock > 0")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.stock = 0")
    List<Product> findOutOfStockProducts();
}
