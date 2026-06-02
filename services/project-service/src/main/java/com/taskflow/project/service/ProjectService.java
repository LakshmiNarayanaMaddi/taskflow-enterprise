package com.taskflow.project.service;

import com.taskflow.project.dto.ProjectRequest;
import com.taskflow.project.dto.ProjectResponse;
import com.taskflow.project.entity.Project;
import com.taskflow.project.entity.ProjectMember;
import com.taskflow.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request,
                                         String ownerId) {

        // Create the project
        Project project = Project.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .status(Project.Status.ACTIVE)
                .ownerId(ownerId)
                .build();

        // Add owner as first member
        ProjectMember ownerMember = ProjectMember.builder()
                .id(UUID.randomUUID().toString())
                .project(project)
                .userId(ownerId)
                .role(ProjectMember.Role.OWNER)
                .build();

        project.getMembers().add(ownerMember);

        Project saved = projectRepository.save(project);
        log.info("Project created: {} by user: {}",
                saved.getId(), ownerId);

        return mapToResponse(saved);
    }

    public List<ProjectResponse> getMyProjects(String userId) {
        return projectRepository.findByOwnerId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(String projectId,
                                          String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found: "
                                + projectId));
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(String projectId,
                                         ProjectRequest request,
                                         String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found: "
                                + projectId));

        // Only owner can update
        if (!project.getOwnerId().equals(userId)) {
            throw new RuntimeException(
                    "Only the project owner can update the project");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        return mapToResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found: "
                                + projectId));

        if (!project.getOwnerId().equals(userId)) {
            throw new RuntimeException(
                    "Only the project owner can delete the project");
        }

        projectRepository.delete(project);
        log.info("Project deleted: {} by user: {}", projectId, userId);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus().name())
                .ownerId(project.getOwnerId())
                .taskCount(project.getTasks().size())
                .memberCount(project.getMembers().size())
                .createdAt(project.getCreatedAt())
                .build();
    }
}