package com.erp.repository;

import com.erp.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByCustomerId(Long customerId);
    
    List<Invoice> findByStatus(String status);
    
    List<Invoice> findBySalesOrderId(Long salesOrderId);
    
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :today AND i.status NOT IN ('paid', 'cancelled')")
    List<Invoice> findOverdueInvoices(LocalDate today);
    
    @Query("SELECT i FROM Invoice i WHERE i.invoiceDate >= :startDate ORDER BY i.invoiceDate DESC")
    List<Invoice> findRecentInvoices(LocalDate startDate);
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    Long countByStatus(String status);
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'paid'")
    Double getTotalPaidAmount();
    
    @Query("SELECT SUM(i.balanceDue) FROM Invoice i WHERE i.status != 'paid'")
    Double getTotalOutstanding();
}
