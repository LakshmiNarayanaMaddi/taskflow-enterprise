-- Identity service database (already created as default)
-- Create additional databases for other services

CREATE DATABASE taskflow_projects;
CREATE DATABASE taskflow_integrations;

-- Grant all privileges to our user
GRANT ALL PRIVILEGES ON DATABASE taskflow_identity TO taskflow;
GRANT ALL PRIVILEGES ON DATABASE taskflow_projects TO taskflow;
GRANT ALL PRIVILEGES ON DATABASE taskflow_integrations TO taskflow;