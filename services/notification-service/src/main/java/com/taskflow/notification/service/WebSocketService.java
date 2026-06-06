package com.taskflow.notification.service;

import com.taskflow.notification.document.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(
            String userId,
            Notification notification) {
        try {
            // Send to user-specific WebSocket channel
            // Frontend subscribes to /user/{userId}/queue/notifications
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notification
            );
            log.info("WebSocket notification sent to user: {}",
                    userId);
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification: {}",
                    e.getMessage());
        }
    }
}