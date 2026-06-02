package com.taskflow.project.repository;

import com.taskflow.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository
        extends JpaRepository<Project, String> {

    List<Project> findByOwnerId(String ownerId);

    List<Project> findByMembersUserId(String userId);

    boolean existsByIdAndOwnerId(String id, String ownerId);
}