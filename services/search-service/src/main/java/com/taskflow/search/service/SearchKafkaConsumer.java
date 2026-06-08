package com.taskflow.search.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.search.event.SearchEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchKafkaConsumer {

    private final SearchService searchService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "task.assigned",
            groupId = "search-service-group"
    )
    public void handleTaskCreated(String message) {
        try {
            SearchEvent event = objectMapper.readValue(
                    message, SearchEvent.class);

            if ("TASK_ASSIGNED".equals(event.getEventType())) {
                searchService.indexTask(event);
            }
        } catch (Exception e) {
            log.error("Error indexing task: {}", e.getMessage());
        }
    }

    @KafkaListener(
            topics = "task.status.changed",
            groupId = "search-service-group"
    )
    public void handleTaskStatusChanged(String message) {
        try {
            SearchEvent event = objectMapper.readValue(
                    message, SearchEvent.class);

            searchService.updateTaskStatus(
                    event.getEntityId(), event.getStatus());
        } catch (Exception e) {
            log.error("Error updating task index: {}",
                    e.getMessage());
        }
    }
}