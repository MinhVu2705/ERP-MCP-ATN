package com.erp.repository;

import com.erp.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    
    List<PurchaseOrder> findBySupplierId(Long supplierId);
    
    List<PurchaseOrder> findByStatus(String status);
    
    List<PurchaseOrder> findByPaymentStatus(String paymentStatus);
    
    @Query("SELECT po FROM PurchaseOrder po WHERE po.orderDate >= :startDate ORDER BY po.orderDate DESC")
    List<PurchaseOrder> findRecentOrders(LocalDate startDate);
    
    @Query("SELECT po FROM PurchaseOrder po WHERE po.expectedDate < :today AND po.status NOT IN ('received', 'cancelled')")
    List<PurchaseOrder> findPendingOrders(LocalDate today);
    
    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.status = :status")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(po.grandTotal) FROM PurchaseOrder po WHERE po.status = 'received'")
    Double getTotalPurchased();
}
