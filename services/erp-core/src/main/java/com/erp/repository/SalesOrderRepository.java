package com.erp.repository;

import com.erp.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    
    Optional<SalesOrder> findByOrderNumber(String orderNumber);
    
    List<SalesOrder> findByCustomerId(Long customerId);
    
    List<SalesOrder> findByStatus(String status);
    
    List<SalesOrder> findByPaymentStatus(String paymentStatus);
    
    @Query("SELECT so FROM SalesOrder so WHERE so.orderDate >= :startDate ORDER BY so.orderDate DESC")
    List<SalesOrder> findRecentOrders(LocalDateTime startDate);
    
    @Query("SELECT so FROM SalesOrder so WHERE so.status = :status ORDER BY so.orderDate DESC")
    List<SalesOrder> findByStatusOrderByOrderDateDesc(String status);
    
    @Query("SELECT COUNT(so) FROM SalesOrder so WHERE so.status = :status")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(so.grandTotal) FROM SalesOrder so WHERE so.status NOT IN ('cancelled')")
    Double getTotalRevenue();
}
