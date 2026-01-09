package com.erp.service;

import com.erp.entity.Transaction;
import com.erp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataImportService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public int importCSV(MultipartFile file) throws Exception {
        List<Transaction> transactions = new ArrayList<>();
        
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                
                String[] values = line.split(",");
                if (values.length >= 10) {
                    Transaction transaction = new Transaction();
                    transaction.setTransactionDate(LocalDate.parse(values[0], DateTimeFormatter.ISO_DATE));
                    transaction.setCustomerName(values[1]);
                    transaction.setTransactionType(values[2]);
                    transaction.setRevenue(new BigDecimal(values[3]));
                    transaction.setCost(new BigDecimal(values[4]));
                    transaction.setProduct(values[5]);
                    transaction.setOrderStatus(values[6]);
                    transaction.setDepartment(values[7]);
                    transaction.setProfit(new BigDecimal(values[8]));
                    transaction.setForecastedRevenue(new BigDecimal(values[9]));
                    
                    transactions.add(transaction);
                }
            }
        }
        
        // Batch save
        transactionRepository.saveAll(transactions);
        return transactions.size();
    }
    
    public void clearAllData() {
        transactionRepository.deleteAll();
    }
}
