import { gql } from '@apollo/client';

// Organization Queries
export const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    allOrganizations {
      id
      name
      slug
      contactEmail
      projectCount
      createdAt
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      projectCount
      createdAt
      updatedAt
    }
  }
`;

// Project Queries
export const GET_ALL_PROJECTS = gql`
  query GetAllProjects($organizationSlug: String, $status: String) {
    allProjects(organizationSlug: $organizationSlug, status: $status) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
      completionRate
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
      completionRate
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats($projectId: ID!) {
    projectStats(projectId: $projectId) {
      totalTasks
      todoTasks
      inProgressTasks
      doneTasks
      completionRate
    }
  }
`;

// Task Queries
export const GET_ALL_TASKS = gql`
  query GetAllTasks($projectId: ID, $status: String, $assigneeEmail: String) {
    allTasks(projectId: $projectId, status: $status, assigneeEmail: $assigneeEmail) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      commentCount
      createdAt
      updatedAt
      project {
        id
        name
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      commentCount
      createdAt
      updatedAt
      project {
        id
        name
      }
    }
  }
`;

// Comment Queries
export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
      updatedAt
    }
  }
`;
