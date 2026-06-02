-- V1: Create projects table
CREATE TABLE projects (
                          id          VARCHAR(36) PRIMARY KEY,
                          name        VARCHAR(255) NOT NULL,
                          description TEXT,
                          status      VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
                          owner_id    VARCHAR(36)  NOT NULL,
                          created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                          updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by owner
CREATE INDEX idx_projects_owner_id ON projects(owner_id);