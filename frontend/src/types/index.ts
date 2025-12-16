// TypeScript interfaces for the application

export interface Organization {
    id: string;
    name: string;
    slug: string;
    contactEmail: string;
    createdAt: string;
    updatedAt: string;
    projectCount?: number;
}

export interface Project {
    id: string;
    organization: Organization;
    name: string;
    description: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    taskCount?: number;
    completedTasks?: number;
    completionRate?: number;
}

export interface Task {
    id: string;
    project: Project;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assigneeEmail: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    commentCount?: number;
}

export interface TaskComment {
    id: string;
    task: Task;
    content: string;
    authorEmail: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectStats {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    completionRate: number;
}

// Form input types
export interface ProjectInput {
    organizationSlug: string;
    name: string;
    description?: string;
    status?: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
    dueDate?: string;
}

export interface TaskInput {
    projectId: string;
    title: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assigneeEmail?: string;
    dueDate?: string;
}

export interface CommentInput {
    taskId: string;
    content: string;
    authorEmail: string;
}
