package com.taskflow.search.repository;

import com.taskflow.search.document.TaskDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskSearchRepository
        extends ElasticsearchRepository<TaskDocument, String> {

    List<TaskDocument> findByTitleContainingOrDescriptionContaining(
            String title, String description);

    List<TaskDocument> findByProjectId(String projectId);

    List<TaskDocument> findByStatus(String status);
}