package com.erp.repository;

import com.erp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    Optional<Employee> findByEmail(String email);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByStatus(String status);
    
    List<Employee> findByEmploymentType(String employmentType);
    
    List<Employee> findByPosition(String position);
    
    @Query("SELECT e FROM Employee e WHERE e.status = 'active' ORDER BY e.hireDate")
    List<Employee> findActiveEmployees();
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = :status")
    Long countByStatus(String status);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :department AND e.status = 'active'")
    Long countByDepartment(String department);
    
    @Query("SELECT DISTINCT e.department FROM Employee e WHERE e.department IS NOT NULL ORDER BY e.department")
    List<String> findAllDepartments();
}
