# API Documentation

Complete GraphQL API documentation for the Project Management System.

## Base URL

```
http://localhost:8000/graphql/
```

## GraphQL Playground

Access the interactive GraphQL playground at: `http://localhost:8000/graphql/`

## Schema Overview

The API provides queries and mutations for managing:
- Organizations
- Projects
- Tasks
- Task Comments

## Authentication

Currently, the API does not require authentication. For production use, implement JWT tokens or session-based authentication.

## Data Models

### Organization
```graphql
type OrganizationType {
  id: ID!
  name: String!
  slug: String!
  contactEmail: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  projectCount: Int
  projects: [ProjectType]
}
```

### Project
```graphql
type ProjectType {
  id: ID!
  organization: OrganizationType!
  name: String!
  description: String
  status: String!  # ACTIVE, COMPLETED, ON_HOLD
  dueDate: Date
  createdAt: DateTime!
  updatedAt: DateTime!
  taskCount: Int
  completedTasks: Int
  completionRate: Float
  tasks: [TaskType]
}
```

### Task
```graphql
type TaskType {
  id: ID!
  project: ProjectType!
  title: String!
  description: String
  status: String!  # TODO, IN_PROGRESS, DONE
  assigneeEmail: String
  dueDate: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  commentCount: Int
  comments: [TaskCommentType]
}
```

### TaskComment
```graphql
type TaskCommentType {
  id: ID!
  task: TaskType!
  content: String!
  authorEmail: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### ProjectStats
```graphql
type ProjectStatsType {
  totalTasks: Int!
  todoTasks: Int!
  inProgressTasks: Int!
  doneTasks: Int!
  completionRate: Float!
}
```

## Queries

### Get All Organizations

```graphql
query {
  allOrganizations {
    id
    name
    slug
    contactEmail
    projectCount
    createdAt
  }
}
```

### Get Organization by Slug

```graphql
query {
  organization(slug: "acme-corp") {
    id
    name
    slug
    contactEmail
    projectCount
    projects {
      id
      name
      status
    }
  }
}
```

### Get All Projects

```graphql
query {
  allProjects(organizationSlug: "acme-corp", status: "ACTIVE") {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    completionRate
    organization {
      name
    }
  }
}
```

**Parameters:**
- `organizationSlug` (String, optional): Filter by organization
- `status` (String, optional): Filter by status (ACTIVE, COMPLETED, ON_HOLD)

### Get Project by ID

```graphql
query {
  project(id: "1") {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    completionRate
    organization {
      name
      slug
    }
  }
}
```

### Get Project Statistics

```graphql
query {
  projectStats(projectId: "1") {
    totalTasks
    todoTasks
    inProgressTasks
    doneTasks
    completionRate
  }
}
```

### Get All Tasks

```graphql
query {
  allTasks(projectId: "1", status: "TODO") {
    id
    title
    description
    status
    assigneeEmail
    dueDate
    commentCount
    project {
      name
    }
  }
}
```

**Parameters:**
- `projectId` (ID, optional): Filter by project
- `status` (String, optional): Filter by status (TODO, IN_PROGRESS, DONE)
- `assigneeEmail` (String, optional): Filter by assignee

### Get Task by ID

```graphql
query {
  task(id: "1") {
    id
    title
    description
    status
    assigneeEmail
    dueDate
    commentCount
    project {
      name
    }
  }
}
```

### Get Task Comments

```graphql
query {
  taskComments(taskId: "1") {
    id
    content
    authorEmail
    createdAt
  }
}
```

## Mutations

### Create Organization

```graphql
mutation {
  createOrganization(
    name: "Acme Corporation"
    contactEmail: "contact@acme.com"
    slug: "acme-corp"
  ) {
    organization {
      id
      name
      slug
      contactEmail
    }
    success
    errors
  }
}
```

**Parameters:**
- `name` (String, required): Organization name
- `contactEmail` (String, required): Contact email
- `slug` (String, optional): URL-friendly identifier (auto-generated if not provided)

### Create Project

```graphql
mutation {
  createProject(
    organizationSlug: "acme-corp"
    name: "Website Redesign"
    description: "Complete redesign of company website"
    status: "ACTIVE"
    dueDate: "2024-12-31"
  ) {
    project {
      id
      name
      description
      status
      dueDate
    }
    success
    errors
  }
}
```

**Parameters:**
- `organizationSlug` (String, required): Organization identifier
- `name` (String, required): Project name
- `description` (String, optional): Project description
- `status` (String, optional): Project status (default: ACTIVE)
- `dueDate` (Date, optional): Due date

### Update Project

```graphql
mutation {
  updateProject(
    id: "1"
    name: "Website Redesign v2"
    status: "COMPLETED"
  ) {
    project {
      id
      name
      status
      updatedAt
    }
    success
    errors
  }
}
```

**Parameters:**
- `id` (ID, required): Project ID
- `name` (String, optional): New project name
- `description` (String, optional): New description
- `status` (String, optional): New status
- `dueDate` (Date, optional): New due date

### Delete Project

```graphql
mutation {
  deleteProject(id: "1") {
    success
    errors
  }
}
```

### Create Task

```graphql
mutation {
  createTask(
    projectId: "1"
    title: "Design homepage mockup"
    description: "Create high-fidelity mockup for homepage"
    status: "TODO"
    assigneeEmail: "designer@acme.com"
    dueDate: "2024-01-15T17:00:00"
  ) {
    task {
      id
      title
      description
      status
      assigneeEmail
      dueDate
    }
    success
    errors
  }
}
```

**Parameters:**
- `projectId` (ID, required): Project ID
- `title` (String, required): Task title
- `description` (String, optional): Task description
- `status` (String, optional): Task status (default: TODO)
- `assigneeEmail` (String, optional): Assignee email
- `dueDate` (DateTime, optional): Due date and time

### Update Task

```graphql
mutation {
  updateTask(
    id: "1"
    status: "IN_PROGRESS"
    assigneeEmail: "developer@acme.com"
  ) {
    task {
      id
      status
      assigneeEmail
      updatedAt
    }
    success
    errors
  }
}
```

**Parameters:**
- `id` (ID, required): Task ID
- `title` (String, optional): New title
- `description` (String, optional): New description
- `status` (String, optional): New status
- `assigneeEmail` (String, optional): New assignee
- `dueDate` (DateTime, optional): New due date

### Delete Task

```graphql
mutation {
  deleteTask(id: "1") {
    success
    errors
  }
}
```

### Add Comment

```graphql
mutation {
  addComment(
    taskId: "1"
    content: "Great progress on this task!"
    authorEmail: "manager@acme.com"
  ) {
    comment {
      id
      content
      authorEmail
      createdAt
    }
    success
    errors
  }
}
```

**Parameters:**
- `taskId` (ID, required): Task ID
- `content` (String, required): Comment content
- `authorEmail` (String, required): Author email

## Error Handling

All mutations return a response with:
- `success` (Boolean): Indicates if the operation succeeded
- `errors` (List[String]): List of error messages if operation failed

Example error response:
```json
{
  "data": {
    "createProject": {
      "project": null,
      "success": false,
      "errors": ["Organization not found"]
    }
  }
}
```

## Common Error Messages

- `"Organization not found"`: Invalid organization slug
- `"Project not found"`: Invalid project ID
- `"Task not found"`: Invalid task ID
- Validation errors for invalid email formats, required fields, etc.

## Rate Limiting

Currently, no rate limiting is implemented. For production use, implement rate limiting middleware.

## Pagination

The current implementation does not include pagination. For large datasets, consider implementing cursor-based pagination.

## Best Practices

1. **Use Fragments**: Reuse common field selections
   ```graphql
   fragment ProjectFields on ProjectType {
     id
     name
     status
     taskCount
     completionRate
   }
   
   query {
     allProjects {
       ...ProjectFields
     }
   }
   ```

2. **Request Only Needed Fields**: Avoid over-fetching
   ```graphql
   # Good
   query {
     allProjects {
       id
       name
       status
     }
   }
   
   # Avoid
   query {
     allProjects {
       id
       name
       status
       description
       tasks {
         # ... all task fields
       }
     }
   }
   ```

3. **Use Variables**: Make queries reusable
   ```graphql
   query GetProject($id: ID!) {
     project(id: $id) {
       id
       name
       status
     }
   }
   ```

## Example Workflows

### Complete Project Creation Workflow

1. Create organization
2. Create project for that organization
3. Create tasks for the project
4. Add comments to tasks
5. Update task statuses as work progresses
6. View project statistics

### Multi-tenant Data Access

All queries automatically filter by organization when `organizationSlug` is provided, ensuring proper data isolation between tenants.

## Support

For issues or questions, please refer to the main README or create an issue in the repository.
