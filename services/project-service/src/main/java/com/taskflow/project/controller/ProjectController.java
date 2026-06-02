package com.taskflow.project.controller;

import com.taskflow.project.dto.ProjectRequest;
import com.taskflow.project.dto.ProjectResponse;
import com.taskflow.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal String userId) {

        log.info("Creating project for user: {}", userId);
        ProjectResponse response =
                projectService.createProject(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                projectService.getMyProjects(userId));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable String projectId,
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                projectService.getProjectById(projectId, userId));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable String projectId,
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                projectService.updateProject(
                        projectId, request, userId));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable String projectId,
            @AuthenticationPrincipal String userId) {

        projectService.deleteProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}