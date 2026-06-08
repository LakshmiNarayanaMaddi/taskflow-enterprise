package com.taskflow.search.service;

import com.taskflow.search.document.ProjectDocument;
import com.taskflow.search.document.TaskDocument;
import com.taskflow.search.dto.SearchResponse;
import com.taskflow.search.event.SearchEvent;
import com.taskflow.search.repository.ProjectSearchRepository;
import com.taskflow.search.repository.TaskSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final TaskSearchRepository taskSearchRepository;
    private final ProjectSearchRepository projectSearchRepository;

    // Index a task in Elasticsearch
    public void indexTask(SearchEvent event) {
        TaskDocument doc = TaskDocument.builder()
                .id(event.getEntityId())
                .title(event.getTitle())
                .description(event.getDescription())
                .status(event.getStatus())
                .priority(event.getPriority())
                .projectId(event.getProjectId())
                .projectName(event.getProjectName())
                .assigneeId(event.getAssigneeId())
                .reporterId(event.getReporterId())
                .createdAt(LocalDateTime.now())
                .build();

        taskSearchRepository.save(doc);
        log.info("Task indexed: {}", event.getEntityId());
    }

    // Index a project in Elasticsearch
    public void indexProject(SearchEvent event) {
        ProjectDocument doc = ProjectDocument.builder()
                .id(event.getEntityId())
                .name(event.getTitle())
                .description(event.getDescription())
                .status(event.getStatus())
                .ownerId(event.getOwnerId())
                .createdAt(LocalDateTime.now())
                .build();

        projectSearchRepository.save(doc);
        log.info("Project indexed: {}", event.getEntityId());
    }

    // Search across tasks and projects
    public SearchResponse search(String query) {
        List<TaskDocument> tasks = taskSearchRepository
                .findByTitleContainingOrDescriptionContaining(
                        query, query);

        List<ProjectDocument> projects = projectSearchRepository
                .findByNameContainingOrDescriptionContaining(
                        query, query);

        log.info("Search for '{}' returned {} tasks and {} projects",
                query, tasks.size(), projects.size());

        return SearchResponse.builder()
                .query(query)
                .tasks(tasks)
                .projects(projects)
                .totalResults(tasks.size() + projects.size())
                .build();
    }

    // Delete task from index
    public void deleteTask(String taskId) {
        taskSearchRepository.deleteById(taskId);
        log.info("Task removed from index: {}", taskId);
    }

    // Update task status in index
    public void updateTaskStatus(String taskId, String status) {
        taskSearchRepository.findById(taskId).ifPresent(doc -> {
            doc.setStatus(status);
            taskSearchRepository.save(doc);
            log.info("Task status updated in index: {}", taskId);
        });
    }
}