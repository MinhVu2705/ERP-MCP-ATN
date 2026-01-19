package com.erp.service;

import com.erp.entity.Transaction;
import com.erp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DataImportService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${ai.engine.url:http://localhost:8001}")
    private String aiEngineUrl;
    
    public int importCSV(MultipartFile file) throws Exception {
        List<Transaction> transactions = new ArrayList<>();
        
        // Step 1: Process CSV with AI Engine for validation and enrichment
        Map<String, Object> aiProcessingResult = processCSVWithAI(file);
        
        if (aiProcessingResult != null && aiProcessingResult.containsKey("processed_data")) {
            List<Map<String, String>> processedData = (List<Map<String, String>>) aiProcessingResult.get("processed_data");
            
            // Use AI-processed data
            for (Map<String, String> row : processedData) {
                Transaction transaction = createTransactionFromRow(row);
                if (transaction != null) {
                    transactions.add(transaction);
                }
            }
        } else {
            // Fallback: Process directly without AI
            transactions = parseCSVDirectly(file);
        }
        
        // Batch save
        transactionRepository.saveAll(transactions);
        return transactions.size();
    }
    
    private Map<String, Object> processCSVWithAI(MultipartFile file) {
        try {
            // Call AI Engine to process CSV
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            String url = aiEngineUrl + "/api/csv/process-csv";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
        } catch (Exception e) {
            // Log error but don't fail - fallback to direct processing
            System.err.println("AI processing failed: " + e.getMessage());
        }
        return null;
    }
    
    private List<Transaction> parseCSVDirectly(MultipartFile file) throws Exception {
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
        return transactions;
    }
    
    private Transaction createTransactionFromRow(Map<String, String> row) {
        try {
            Transaction transaction = new Transaction();
            transaction.setTransactionDate(LocalDate.parse(row.get("Date"), DateTimeFormatter.ISO_DATE));
            transaction.setCustomerName(row.get("Customer"));
            transaction.setTransactionType(row.get("TransactionType"));
            transaction.setRevenue(new BigDecimal(row.get("Revenue")));
            transaction.setCost(new BigDecimal(row.get("Cost")));
            transaction.setProduct(row.get("Product"));
            transaction.setOrderStatus(row.get("OrderStatus"));
            transaction.setDepartment(row.get("Department"));
            transaction.setProfit(new BigDecimal(row.get("Profit")));
            transaction.setForecastedRevenue(new BigDecimal(row.getOrDefault("ForecastedRevenue", "0")));
            
            return transaction;
        } catch (Exception e) {
            System.err.println("Failed to create transaction from row: " + e.getMessage());
            return null;
        }
    }
    
    public void clearAllData() {
        transactionRepository.deleteAll();
    }
}
