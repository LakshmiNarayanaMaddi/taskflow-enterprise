package com.taskflow.search.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Document(indexName = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String status;

    @Field(type = FieldType.Keyword)
    private String priority;

    @Field(type = FieldType.Keyword)
    private String projectId;

    @Field(type = FieldType.Keyword)
    private String projectName;

    @Field(type = FieldType.Keyword)
    private String assigneeId;

    @Field(type = FieldType.Keyword)
    private String reporterId;

    @Field(type = FieldType.Date)
    private LocalDateTime createdAt;
}