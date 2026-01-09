package com.erp.repository;

import com.erp.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t WHERE t.transactionDate BETWEEN ?1 AND ?2")
    List<Transaction> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.department = ?1")
    List<Transaction> findByDepartment(String department);
    
    @Query("SELECT SUM(t.revenue) FROM Transaction t WHERE t.transactionDate BETWEEN ?1 AND ?2")
    Double sumRevenueByDateRange(LocalDate startDate, LocalDate endDate);
}
