package com.taskflow.search.controller;

import com.taskflow.search.document.ProjectDocument;
import com.taskflow.search.document.TaskDocument;
import com.taskflow.search.repository.ProjectSearchRepository;
import com.taskflow.search.repository.TaskSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/index")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
public class IndexController {

    private final TaskSearchRepository taskSearchRepository;
    private final ProjectSearchRepository projectSearchRepository;

    // Manually index a project
    @PostMapping("/projects")
    public ResponseEntity<Map<String, String>> indexProject(
            @RequestBody Map<String, String> data) {

        ProjectDocument doc = ProjectDocument.builder()
                .id(data.get("id"))
                .name(data.get("name"))
                .description(data.get("description"))
                .status(data.get("status"))
                .ownerId(data.get("ownerId"))
                .createdAt(LocalDateTime.now())
                .build();

        projectSearchRepository.save(doc);
        log.info("Manually indexed project: {}", data.get("id"));

        return ResponseEntity.ok(Map.of(
                "message", "Project indexed successfully",
                "id", data.get("id")
        ));
    }

    // Manually index a task
    @PostMapping("/tasks")
    public ResponseEntity<Map<String, String>> indexTask(
            @RequestBody Map<String, String> data) {

        TaskDocument doc = TaskDocument.builder()
                .id(data.get("id"))
                .title(data.get("title"))
                .description(data.get("description"))
                .status(data.get("status"))
                .priority(data.get("priority"))
                .projectId(data.get("projectId"))
                .projectName(data.get("projectName"))
                .assigneeId(data.get("assigneeId"))
                .reporterId(data.get("reporterId"))
                .createdAt(LocalDateTime.now())
                .build();

        taskSearchRepository.save(doc);
        log.info("Manually indexed task: {}", data.get("id"));

        return ResponseEntity.ok(Map.of(
                "message", "Task indexed successfully",
                "id", data.get("id")
        ));
    }

    // Check what is indexed
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalTasks",    taskSearchRepository.count(),
                "totalProjects", projectSearchRepository.count()
        ));
    }
}