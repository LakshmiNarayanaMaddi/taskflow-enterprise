package com.taskflow.project.service;

import com.taskflow.project.dto.TaskRequest;
import com.taskflow.project.dto.TaskResponse;
import com.taskflow.project.entity.Project;
import com.taskflow.project.entity.Task;
import com.taskflow.project.repository.ProjectRepository;
import com.taskflow.project.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.taskflow.project.event.TaskEvent;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final KafkaProducerService kafkaProducerService;

        @Transactional
        public TaskResponse createTask(String projectId,
                                       TaskRequest request,
                                       String reporterId) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() ->
                            new RuntimeException("Project not found: "
                                    + projectId));

            Task task = Task.builder()
                    .id(UUID.randomUUID().toString())
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .status(Task.Status.TODO)
                    .priority(Task.Priority.valueOf(
                            request.getPriority().toUpperCase()))
                    .project(project)
                    .assigneeId(request.getAssigneeId())
                    .reporterId(reporterId)
                    .dueDate(request.getDueDate() != null
                            ? LocalDateTime.parse(request.getDueDate())
                            : null)
                    .build();

            Task saved = taskRepository.save(task);

            // Publish Kafka event if task has assignee
            if (saved.getAssigneeId() != null) {
                kafkaProducerService.publishTaskAssigned(
                        TaskEvent.builder()
                                .eventType("TASK_ASSIGNED")
                                .taskId(saved.getId())
                                .taskTitle(saved.getTitle())
                                .projectId(project.getId())
                                .projectName(project.getName())
                                .assigneeId(saved.getAssigneeId())
                                .reporterId(saved.getReporterId())
                                .timestamp(System.currentTimeMillis())
                                .build()
                );
            }

            log.info("Task created: {}", saved.getId());
            return mapToResponse(saved);
        }

        @Transactional
        public TaskResponse updateTaskStatus(String taskId,
                                             String status,
                                             String userId) {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() ->
                            new RuntimeException("Task not found: "
                                    + taskId));

            task.setStatus(Task.Status.valueOf(status.toUpperCase()));
            Task saved = taskRepository.save(task);

            // Publish status change event
            kafkaProducerService.publishTaskStatusChanged(
                    TaskEvent.builder()
                            .eventType("TASK_STATUS_CHANGED")
                            .taskId(saved.getId())
                            .taskTitle(saved.getTitle())
                            .projectId(saved.getProject().getId())
                            .projectName(saved.getProject().getName())
                            .assigneeId(saved.getAssigneeId())
                            .reporterId(saved.getReporterId())
                            .status(status)
                            .changedByUserId(userId)
                            .timestamp(System.currentTimeMillis())
                            .build()
            );

            log.info("Task {} status changed to {} by user {}",
                    taskId, status, userId);
            return mapToResponse(saved);
        }



    public List<TaskResponse> getTasksByProject(String projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found: " + taskId));
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse assignTask(String taskId,
                                   String assigneeId,
                                   String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found: " + taskId));

        task.setAssigneeId(assigneeId);
        log.info("Task {} assigned to {} by user {}",
                taskId, assigneeId, userId);

        return mapToResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(String taskId, String userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found: " + taskId));

        taskRepository.delete(task);
        log.info("Task {} deleted by user {}", taskId, userId);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .priority(task.getPriority().name())
                .projectId(task.getProject().getId())
                .assigneeId(task.getAssigneeId())
                .reporterId(task.getReporterId())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .build();
    }
}