package com.erp.repository;

import com.erp.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    
    Optional<Warehouse> findByWarehouseCode(String warehouseCode);
    
    List<Warehouse> findByStatus(String status);
    
    List<Warehouse> findByType(String type);
    
    List<Warehouse> findByCity(String city);
    
    @Query("SELECT w FROM Warehouse w WHERE w.status = 'active' ORDER BY w.currentStock DESC")
    List<Warehouse> findActiveWarehouses();
    
    @Query("SELECT COUNT(w) FROM Warehouse w WHERE w.status = :status")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(w.currentStock) FROM Warehouse w WHERE w.status = 'active'")
    Long getTotalStock();
    
    @Query("SELECT SUM(w.capacity) FROM Warehouse w WHERE w.status = 'active'")
    Long getTotalCapacity();
}
