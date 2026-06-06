package com.taskflow.project.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskEvent {

    private String eventType;
    private String taskId;
    private String taskTitle;
    private String projectId;
    private String projectName;
    private String assigneeId;
    private String reporterId;
    private String status;
    private String changedByUserId;
    private long timestamp;
}