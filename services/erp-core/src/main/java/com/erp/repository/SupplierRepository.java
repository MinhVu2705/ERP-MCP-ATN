package com.erp.repository;

import com.erp.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    Optional<Supplier> findByEmail(String email);
    
    List<Supplier> findByStatus(String status);
    
    List<Supplier> findByRating(String rating);
    
    List<Supplier> findByCity(String city);
    
    List<Supplier> findByCountry(String country);
    
    @Query("SELECT s FROM Supplier s WHERE s.status = 'active' ORDER BY s.totalPurchased DESC")
    List<Supplier> findTopSuppliers();
    
    @Query("SELECT s FROM Supplier s WHERE s.rating IN ('excellent', 'good') AND s.status = 'active'")
    List<Supplier> findPreferredSuppliers();
    
    @Query("SELECT COUNT(s) FROM Supplier s WHERE s.status = :status")
    Long countByStatus(String status);
}
