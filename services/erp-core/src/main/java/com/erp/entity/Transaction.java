package com.erp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_date")
    private LocalDate transactionDate;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "transaction_type")
    private String transactionType;
    
    private BigDecimal revenue;
    private BigDecimal cost;
    private String product;
    
    @Column(name = "order_status")
    private String orderStatus;
    
    private String department;
    private BigDecimal profit;
    
    @Column(name = "forecasted_revenue")
    private BigDecimal forecastedRevenue;
    
    // Constructors
    public Transaction() {}
    
    public Transaction(LocalDate transactionDate, String customerName, String transactionType,
                      BigDecimal revenue, BigDecimal cost, String product, String orderStatus,
                      String department, BigDecimal profit, BigDecimal forecastedRevenue) {
        this.transactionDate = transactionDate;
        this.customerName = customerName;
        this.transactionType = transactionType;
        this.revenue = revenue;
        this.cost = cost;
        this.product = product;
        this.orderStatus = orderStatus;
        this.department = department;
        this.profit = profit;
        this.forecastedRevenue = forecastedRevenue;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    
    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
    
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }
    
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public BigDecimal getProfit() { return profit; }
    public void setProfit(BigDecimal profit) { this.profit = profit; }
    
    public BigDecimal getForecastedRevenue() { return forecastedRevenue; }
    public void setForecastedRevenue(BigDecimal forecastedRevenue) { this.forecastedRevenue = forecastedRevenue; }
}
