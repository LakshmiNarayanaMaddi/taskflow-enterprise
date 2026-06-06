package com.taskflow.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.notification.document.Notification;
import com.taskflow.notification.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final NotificationService notificationService;
    private final EmailService emailService;
    private final WebSocketService webSocketService;
    private final ObjectMapper objectMapper;

    // Listen to task.assigned topic
    @KafkaListener(
            topics = "task.assigned",
            groupId = "notification-service-group"
    )
    public void handleTaskAssigned(String message) {
        try {
            log.info("Received task.assigned event: {}", message);

            TaskEvent event = objectMapper.readValue(
                    message, TaskEvent.class);

            // Only notify if there is an assignee
            if (event.getAssigneeId() == null ||
                    event.getAssigneeId().isEmpty()) {
                return;
            }

            // 1. Save notification to MongoDB
            Notification notification =
                    notificationService
                            .createTaskAssignedNotification(event);

            // 2. Push real-time update via WebSocket
            webSocketService.sendNotificationToUser(
                    event.getAssigneeId(), notification);

            // 3. Send email (async)
            emailService.sendTaskAssignedEmail(event);

        } catch (Exception e) {
            log.error("Error processing task.assigned event: {}",
                    e.getMessage(), e);
        }
    }

    // Listen to task.status.changed topic
    @KafkaListener(
            topics = "task.status.changed",
            groupId = "notification-service-group"
    )
    public void handleTaskStatusChanged(String message) {
        try {
            log.info("Received task.status.changed event: {}",
                    message);

            TaskEvent event = objectMapper.readValue(
                    message, TaskEvent.class);

            // Notify the reporter when status changes
            if (event.getReporterId() != null &&
                    !event.getReporterId().equals(
                            event.getChangedByUserId())) {

                Notification notification =
                        notificationService
                                .createStatusChangedNotification(event);

                webSocketService.sendNotificationToUser(
                        event.getReporterId(), notification);
            }

        } catch (Exception e) {
            log.error("Error processing task.status.changed: {}",
                    e.getMessage(), e);
        }
    }
}