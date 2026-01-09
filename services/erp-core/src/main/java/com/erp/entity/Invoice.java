package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String invoiceNumber;
    
    @Column(nullable = false)
    private LocalDate invoiceDate;
    
    private LocalDate dueDate;
    
    @Column(nullable = false)
    private Long customerId;
    
    @Column(length = 255)
    private String customerName;
    
    private Long salesOrderId;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal subtotal;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal discount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal tax;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal paidAmount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal balanceDue;
    
    @Column(length = 50)
    private String status; // draft, sent, paid, overdue, cancelled
    
    @Column(length = 100)
    private String paymentMethod;
    
    private LocalDate paidDate;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "draft";
        }
        calculateBalanceDue();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateBalanceDue();
        updateStatus();
    }
    
    private void calculateBalanceDue() {
        if (totalAmount != null && paidAmount != null) {
            balanceDue = totalAmount.subtract(paidAmount);
        }
    }
    
    private void updateStatus() {
        if (balanceDue != null && balanceDue.compareTo(BigDecimal.ZERO) == 0) {
            status = "paid";
        } else if (dueDate != null && LocalDate.now().isAfter(dueDate) && !"paid".equals(status)) {
            status = "overdue";
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getInvoiceNumber() {
        return invoiceNumber;
    }
    
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    
    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }
    
    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public Long getSalesOrderId() {
        return salesOrderId;
    }
    
    public void setSalesOrderId(Long salesOrderId) {
        this.salesOrderId = salesOrderId;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getDiscount() {
        return discount;
    }
    
    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }
    
    public BigDecimal getTax() {
        return tax;
    }
    
    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public BigDecimal getPaidAmount() {
        return paidAmount;
    }
    
    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }
    
    public BigDecimal getBalanceDue() {
        return balanceDue;
    }
    
    public void setBalanceDue(BigDecimal balanceDue) {
        this.balanceDue = balanceDue;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public LocalDate getPaidDate() {
        return paidDate;
    }
    
    public void setPaidDate(LocalDate paidDate) {
        this.paidDate = paidDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
