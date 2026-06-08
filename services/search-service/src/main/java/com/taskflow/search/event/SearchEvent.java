package com.taskflow.search.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchEvent {

    private String eventType;
    private String entityType;
    private String entityId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String projectId;
    private String projectName;
    private String assigneeId;
    private String reporterId;
    private String ownerId;
    private long timestamp;
}