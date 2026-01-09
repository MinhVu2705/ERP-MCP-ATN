package com.erp.controller;

import com.erp.entity.Invoice;
import com.erp.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices(
            @RequestParam(required = false) String status) {
        
        List<Invoice> invoices;
        if (status != null && !status.isEmpty()) {
            invoices = invoiceRepository.findByStatus(status);
        } else {
            invoices = invoiceRepository.findAll();
        }
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", invoiceRepository.count());
        stats.put("draft", invoiceRepository.countByStatus("draft"));
        stats.put("sent", invoiceRepository.countByStatus("sent"));
        stats.put("paid", invoiceRepository.countByStatus("paid"));
        stats.put("overdue", invoiceRepository.countByStatus("overdue"));
        stats.put("totalPaid", invoiceRepository.getTotalPaidAmount());
        stats.put("totalOutstanding", invoiceRepository.getTotalOutstanding());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/overdue")
    public ResponseEntity<List<Invoice>> getOverdueInvoices() {
        return ResponseEntity.ok(invoiceRepository.findOverdueInvoices(LocalDate.now()));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Invoice>> getRecentInvoices(@RequestParam(defaultValue = "30") int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return ResponseEntity.ok(invoiceRepository.findRecentInvoices(startDate));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Invoice>> getInvoicesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(invoiceRepository.findByCustomerId(customerId));
    }
    
    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        invoice.setInvoiceDate(LocalDate.now());
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }
    
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoiceDetails) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoice.setStatus(invoiceDetails.getStatus());
                    invoice.setPaidAmount(invoiceDetails.getPaidAmount());
                    invoice.setPaymentMethod(invoiceDetails.getPaymentMethod());
                    invoice.setPaidDate(invoiceDetails.getPaidDate());
                    invoice.setNotes(invoiceDetails.getNotes());
                    invoice.setDueDate(invoiceDetails.getDueDate());
                    return ResponseEntity.ok(invoiceRepository.save(invoice));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
