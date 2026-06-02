package com.taskflow.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private String id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String projectId;
    private String assigneeId;
    private String reporterId;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
}