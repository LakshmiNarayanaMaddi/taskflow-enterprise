package com.taskflow.project.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.project.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishTaskAssigned(TaskEvent event) {
        publish("task.assigned", event);
    }

    public void publishTaskStatusChanged(TaskEvent event) {
        publish("task.status.changed", event);
    }

    private void publish(String topic, TaskEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, event.getTaskId(), message);
            log.info("Published {} event for task: {}",
                    topic, event.getTaskId());
        } catch (Exception e) {
            log.error("Failed to publish Kafka event: {}",
                    e.getMessage());
        }
    }
}