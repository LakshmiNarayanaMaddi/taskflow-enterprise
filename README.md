# taskflow-enterprise
Cloud-native microservices project management platform — Java, Spring Boot, React, Kafka, Kubernetes


# TaskFlow Enterprise

A cloud-native, microservices-based project management platform
built with Java 21, Spring Boot 3, React 18, Apache Kafka,
OAuth 2.0, and deployed on AWS EKS with Kubernetes.

## Services
| Service            | Port | Database          |
|--------------------|------|-------------------|
| API Gateway        | 8080 | Redis             |
| Identity Service   | 8081 | PostgreSQL        |
| Project Service    | 8082 | PostgreSQL        |
| Notification Service | 8083 | MongoDB         |
| Integration Service | 8084 | PostgreSQL+Redis |
| Analytics Service  | 8085 | ClickHouse        |
| Search Service     | 8086 | Elasticsearch     |
| File Service       | 8087 | MongoDB + S3      |

## Tech Stack
- **Backend:** Java 21, Spring Boot 3, Spring Security, Kafka
- **Frontend:** React 18, Tailwind CSS, Redux Toolkit
- **Auth:** OAuth 2.0, Keycloak, JWT, MFA
- **Databases:** PostgreSQL, MongoDB, Redis, Elasticsearch, ClickHouse
- **DevOps:** Docker, Kubernetes, AWS EKS, Terraform, GitHub Actions

## Local Setup
See `/docs` folder for setup guides.

## Architecture
8 independent microservices communicating via Apache Kafka,
secured by Keycloak OAuth 2.0, deployed on AWS EKS.