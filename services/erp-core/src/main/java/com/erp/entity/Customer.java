package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phone;
    
    private String location;
    
    @Column(name = "total_spent")
    private BigDecimal totalSpent;
    
    @Column(name = "order_count")
    private Integer orderCount;
    
    @Column(nullable = false)
    private String level; // diamond, gold, silver, new
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "last_purchase_at")
    private LocalDateTime lastPurchaseAt;
    
    // Constructors
    public Customer() {
        this.createdAt = LocalDateTime.now();
        this.totalSpent = BigDecimal.ZERO;
        this.orderCount = 0;
        this.level = "new";
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public BigDecimal getTotalSpent() {
        return totalSpent;
    }
    
    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
        updateLevel();
    }
    
    public Integer getOrderCount() {
        return orderCount;
    }
    
    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
        updateLevel();
    }
    
    public String getLevel() {
        return level;
    }
    
    public void setLevel(String level) {
        this.level = level;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getLastPurchaseAt() {
        return lastPurchaseAt;
    }
    
    public void setLastPurchaseAt(LocalDateTime lastPurchaseAt) {
        this.lastPurchaseAt = lastPurchaseAt;
    }
    
    private void updateLevel() {
        if (totalSpent.compareTo(new BigDecimal("80000000")) >= 0) {
            this.level = "diamond";
        } else if (totalSpent.compareTo(new BigDecimal("50000000")) >= 0) {
            this.level = "gold";
        } else if (totalSpent.compareTo(new BigDecimal("20000000")) >= 0) {
            this.level = "silver";
        } else {
            this.level = "new";
        }
    }
}
