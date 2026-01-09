package com.erp.controller;

import com.erp.entity.Employee;
import com.erp.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status) {
        
        List<Employee> employees;
        if (department != null && !department.isEmpty()) {
            employees = employeeRepository.findByDepartment(department);
        } else if (status != null && !status.isEmpty()) {
            employees = employeeRepository.findByStatus(status);
        } else {
            employees = employeeRepository.findAll();
        }
        return ResponseEntity.ok(employees);
    }
    
    @SuppressWarnings("null")
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", employeeRepository.count());
        stats.put("active", employeeRepository.countByStatus("active"));
        stats.put("onLeave", employeeRepository.countByStatus("on-leave"));
        stats.put("resigned", employeeRepository.countByStatus("resigned"));
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(employeeRepository.findAllDepartments());
    }
    
    @GetMapping("/department/{department}/count")
    public ResponseEntity<Map<String, Object>> getDepartmentCount(@PathVariable String department) {
        Map<String, Object> result = new HashMap<>();
        result.put("department", department);
        result.put("count", employeeRepository.countByDepartment(department));
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Employee>> getActiveEmployees() {
        return ResponseEntity.ok(employeeRepository.findActiveEmployees());
    }
    
    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(savedEmployee);
    }
    
    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    employee.setFirstName(employeeDetails.getFirstName());
                    employee.setLastName(employeeDetails.getLastName());
                    employee.setEmail(employeeDetails.getEmail());
                    employee.setPhone(employeeDetails.getPhone());
                    employee.setDepartment(employeeDetails.getDepartment());
                    employee.setPosition(employeeDetails.getPosition());
                    employee.setSalary(employeeDetails.getSalary());
                    employee.setStatus(employeeDetails.getStatus());
                    employee.setManager(employeeDetails.getManager());
                    employee.setNotes(employeeDetails.getNotes());
                    return ResponseEntity.ok(employeeRepository.save(employee));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
