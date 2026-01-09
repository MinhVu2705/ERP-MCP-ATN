package com.erp.controller;

import com.erp.service.DataImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataImportController {
    
    @Autowired
    private DataImportService dataImportService;
    
    @PostMapping("/upload-csv")
    public ResponseEntity<?> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }
            
            String filename = file.getOriginalFilename();
            if (filename == null || !filename.endsWith(".csv")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only CSV files are allowed"));
            }
            
            int recordsImported = dataImportService.importCSV(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Data imported successfully");
            response.put("recordsImported", recordsImported);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearData() {
        try {
            dataImportService.clearAllData();
            return ResponseEntity.ok(Map.of("success", true, "message", "All data cleared"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getDataStatus() {
        // Add logic to count records
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
