package com.taskflow.notification.service;

import com.taskflow.notification.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendTaskAssignedEmail(TaskEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            // In production this would look up the
            // user's email from Identity Service
            // For now we log it
            log.info("Sending task assigned email for task: {}",
                    event.getTaskTitle());

            message.setSubject(
                    "New task assigned: " + event.getTaskTitle());
            message.setText(
                    "You have been assigned a new task:\n\n"
                            + "Task: " + event.getTaskTitle() + "\n"
                            + "Project: " + event.getProjectName() + "\n\n"
                            + "Log in to TaskFlow to view the task."
            );

            // mailSender.send(message);
            // Commented out until email is configured
            // The rest of the flow works without email

            log.info("Email prepared for task: {}",
                    event.getTaskTitle());

        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
        }
    }
}