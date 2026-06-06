package com.taskflow.notification.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    // Who receives this notification
    @Indexed
    @Field("user_id")
    private String userId;

    // Type of notification
    @Field("type")
    private NotificationType type;

    // Short title shown in notification bell
    @Field("title")
    private String title;

    // Full message
    @Field("message")
    private String message;

    // Related entity (project or task ID)
    @Field("reference_id")
    private String referenceId;

    @Field("reference_type")
    private String referenceType;

    // Has the user read this notification?
    @Field("is_read")
    @Builder.Default
    private boolean read = false;

    @Field("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        TASK_ASSIGNED,
        TASK_STATUS_CHANGED,
        PROJECT_INVITATION,
        COMMENT_ADDED,
        MENTION,
        SYSTEM
    }
}