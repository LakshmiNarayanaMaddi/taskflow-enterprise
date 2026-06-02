-- V2: Create tasks table
CREATE TABLE tasks (
                       id           VARCHAR(36)  PRIMARY KEY,
                       title        VARCHAR(255) NOT NULL,
                       description  TEXT,
                       status       VARCHAR(50)  NOT NULL DEFAULT 'TODO',
                       priority     VARCHAR(50)  NOT NULL DEFAULT 'MEDIUM',
                       project_id   VARCHAR(36)  NOT NULL,
                       assignee_id  VARCHAR(36),
                       reporter_id  VARCHAR(36)  NOT NULL,
                       due_date     TIMESTAMP,
                       created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
                       updated_at   TIMESTAMP    NOT NULL DEFAULT NOW(),

                       CONSTRAINT fk_tasks_project
                           FOREIGN KEY (project_id)
                               REFERENCES projects(id)
                               ON DELETE CASCADE
);

-- Indexes for common queries
CREATE INDEX idx_tasks_project_id  ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status      ON tasks(status);