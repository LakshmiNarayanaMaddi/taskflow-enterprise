package com.taskflow.project.controller;

import com.taskflow.project.dto.TaskRequest;
import com.taskflow.project.dto.TaskResponse;
import com.taskflow.project.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable String projectId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal String userId) {

        TaskResponse response =
                taskService.createTask(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable String projectId,
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                taskService.getTasksByProject(projectId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable String projectId,
            @PathVariable String taskId,
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable String projectId,
            @PathVariable String taskId,
            @RequestParam String status,
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                taskService.updateTaskStatus(taskId, status, userId));
    }

    @PatchMapping("/{taskId}/assign")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable String projectId,
            @PathVariable String taskId,
            @RequestParam String assigneeId,
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                taskService.assignTask(taskId, assigneeId, userId));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable String projectId,
            @PathVariable String taskId,
            @AuthenticationPrincipal String userId) {

        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}