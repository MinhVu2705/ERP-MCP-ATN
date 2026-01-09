package com.erp.repository;

import com.erp.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(String status);

    long countByStatus(String status);

    @Query("SELECT DISTINCT p.status FROM Project p WHERE p.status IS NOT NULL")
    List<String> findAllStatuses();
}
