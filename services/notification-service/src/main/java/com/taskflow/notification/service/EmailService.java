package com.taskflow.notification.service;

import com.taskflow.notification.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async("taskExecutor")
    public void sendTaskAssignedEmail(TaskEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            // In production this looks up assignee email
            // from Identity Service via REST call
            // For now we send to our own email for testing
            message.setFrom(fromEmail);
            message.setTo(fromEmail);
            message.setSubject(
                    "TaskFlow — New task assigned: "
                            + event.getTaskTitle());
            message.setText(
                    "Hello,\n\n"
                            + "You have been assigned a new task:\n\n"
                            + "Task:    " + event.getTaskTitle() + "\n"
                            + "Project: " + event.getProjectName() + "\n"
                            + "Status:  " + "TODO" + "\n\n"
                            + "Log in to TaskFlow to view and manage your task.\n\n"
                            + "— TaskFlow Team"
            );

            mailSender.send(message);
            log.info("Email sent successfully for task: {}",
                    event.getTaskTitle());

        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
        }
    }

    @Async("taskExecutor")
    public void sendTaskStatusChangedEmail(TaskEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(fromEmail);
            message.setSubject(
                    "TaskFlow — Task status updated: "
                            + event.getTaskTitle());
            message.setText(
                    "Hello,\n\n"
                            + "A task you are following has been updated:\n\n"
                            + "Task:       " + event.getTaskTitle() + "\n"
                            + "Project:    " + event.getProjectName() + "\n"
                            + "New Status: " + event.getStatus() + "\n\n"
                            + "Log in to TaskFlow to view the update.\n\n"
                            + "— TaskFlow Team"
            );

            mailSender.send(message);
            log.info("Status change email sent for task: {}",
                    event.getTaskTitle());

        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage());
        }
    }
}