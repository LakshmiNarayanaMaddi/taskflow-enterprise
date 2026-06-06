package com.taskflow.notification.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class KafkaConfig {

    // Declare Kafka topics
    // Spring will create these if they don't exist
    @Bean
    public NewTopic taskAssignedTopic() {
        return TopicBuilder.name("task.assigned")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic taskStatusChangedTopic() {
        return TopicBuilder.name("task.status.changed")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic commentAddedTopic() {
        return TopicBuilder.name("comment.added")
                .partitions(1)
                .replicas(1)
                .build();
    }
}