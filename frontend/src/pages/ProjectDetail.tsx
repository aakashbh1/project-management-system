import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROJECT, GET_PROJECT_STATS } from '../graphql/queries';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TaskBoard } from '../components/Tasks/TaskBoard';
import { format } from 'date-fns';

export const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id,
    });

    const { data: statsData, loading: statsLoading } = useQuery(GET_PROJECT_STATS, {
        variables: { projectId: id },
        skip: !id,
    });

    if (projectLoading || statsLoading) return <LoadingSpinner />;

    const project = projectData?.project;
    const stats = statsData?.projectStats;

    if (!project) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
                <Button onClick={() => navigate('/')} className="mt-4">
                    Back to Projects
                </Button>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            case 'ON_HOLD':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Project Header */}
            <div className="flex items-center space-x-4">
                <Button variant="secondary" onClick={() => navigate('/')}>
                    ← Back
                </Button>
                <div className="flex-1">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-gray-600 mt-1">{project.organization.name}</p>
                </div>
            </div>

            {/* Project Info */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                        <p className="text-gray-900">{project.description || 'No description'}</p>
                    </div>

                    {project.dueDate && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                            <p className="text-gray-900">{format(new Date(project.dueDate), 'MMMM dd, yyyy')}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                        <p className="text-gray-900">{format(new Date(project.createdAt), 'MMMM dd, yyyy')}</p>
                    </div>
                </div>
            </Card>

            {/* Project Statistics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.totalTasks}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">To Do</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.todoTasks}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">In Progress</p>
                                <p className="text-3xl font-bold text-yellow-900">{stats.inProgressTasks}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Completed</p>
                                <p className="text-3xl font-bold text-green-900">{stats.doneTasks}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-900">{Math.round(stats.completionRate)}%</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Task Board */}
            <TaskBoard projectId={id!} />
        </div>
    );
};
