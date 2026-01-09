package com.erp.repository;

import com.erp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    List<Customer> findByLevel(String level);
    
    @Query("SELECT c FROM Customer c ORDER BY c.totalSpent DESC")
    List<Customer> findTopCustomers();
    
    @Query("SELECT c FROM Customer c WHERE c.level = 'diamond' OR c.level = 'gold' ORDER BY c.totalSpent DESC")
    List<Customer> findVIPCustomers();
    
    List<Customer> findByLocation(String location);
}
