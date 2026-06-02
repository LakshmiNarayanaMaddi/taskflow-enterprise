-- V3: Create project members table (who is in which project)
CREATE TABLE project_members (
                                 id         VARCHAR(36) PRIMARY KEY,
                                 project_id VARCHAR(36) NOT NULL,
                                 user_id    VARCHAR(36) NOT NULL,
                                 role       VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
                                 joined_at  TIMESTAMP   NOT NULL DEFAULT NOW(),

                                 CONSTRAINT fk_members_project
                                     FOREIGN KEY (project_id)
                                         REFERENCES projects(id)
                                         ON DELETE CASCADE,

    -- One user can only be in a project once
                                 CONSTRAINT uq_project_member
                                     UNIQUE (project_id, user_id)
);

CREATE INDEX idx_members_project_id ON project_members(project_id);
CREATE INDEX idx_members_user_id    ON project_members(user_id);