package com.taskflow.notification.service;

import com.taskflow.notification.document.Notification;
import com.taskflow.notification.event.TaskEvent;
import com.taskflow.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Called when a task is assigned
    public Notification createTaskAssignedNotification(
            TaskEvent event) {

        Notification notification = Notification.builder()
                .userId(event.getAssigneeId())
                .type(Notification.NotificationType.TASK_ASSIGNED)
                .title("New task assigned to you")
                .message("You have been assigned: \""
                        + event.getTaskTitle()
                        + "\" in project "
                        + event.getProjectName())
                .referenceId(event.getTaskId())
                .referenceType("TASK")
                .build();

        Notification saved =
                notificationRepository.save(notification);
        log.info("Notification created for user: {}",
                event.getAssigneeId());
        return saved;
    }

    // Called when task status changes
    public Notification createStatusChangedNotification(
            TaskEvent event) {

        Notification notification = Notification.builder()
                .userId(event.getReporterId())
                .type(Notification.NotificationType
                        .TASK_STATUS_CHANGED)
                .title("Task status updated")
                .message("Task \"" + event.getTaskTitle()
                        + "\" moved to " + event.getStatus())
                .referenceId(event.getTaskId())
                .referenceType("TASK")
                .build();

        return notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<Notification> getNotifications(String userId) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get unread count
    public long getUnreadCount(String userId) {
        return notificationRepository
                .countByUserIdAndReadFalse(userId);
    }

    // Mark all as read
    public void markAllAsRead(String userId) {
        List<Notification> unread =
                notificationRepository
                        .findByUserIdAndReadFalse(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        log.info("Marked {} notifications as read for user: {}",
                unread.size(), userId);
    }

    // Mark single notification as read
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId)
                .ifPresent(n -> {
                    n.setRead(true);
                    notificationRepository.save(n);
                });
    }
}