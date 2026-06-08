package com.taskflow.search.repository;

import com.taskflow.search.document.ProjectDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectSearchRepository
        extends ElasticsearchRepository<ProjectDocument, String> {

    List<ProjectDocument> findByNameContainingOrDescriptionContaining(
            String name, String description);

    List<ProjectDocument> findByOwnerId(String ownerId);
}