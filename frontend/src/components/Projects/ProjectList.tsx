import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS } from '../../graphql/queries';
import { Project } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ProjectForm } from './ProjectForm';
import { format } from 'date-fns';

interface ProjectListProps {
    organizationSlug: string | null;
}

export const ProjectList: React.FC<ProjectListProps> = ({ organizationSlug }) => {
    const [showForm, setShowForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const { data, loading, error, refetch } = useQuery(GET_ALL_PROJECTS, {
        variables: {
            organizationSlug: organizationSlug || undefined,
            status: statusFilter || undefined
        },
        skip: !organizationSlug,
    });

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

    const getStatusBadge = (status: string) => {
        const label = status.replace('_', ' ');
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {label}
            </span>
        );
    };

    if (!organizationSlug) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No organization selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Select an organization from the sidebar to view projects</p>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error loading projects: {error.message}</p>
            </div>
        );
    }

    const projects: Project[] = data?.allProjects || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ON_HOLD">On Hold</option>
                    </select>
                    <Button onClick={() => { setSelectedProject(null); setShowForm(true); }}>
                        + New Project
                    </Button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <ProjectForm
                            organizationSlug={organizationSlug}
                            project={selectedProject}
                            onClose={() => { setShowForm(false); setSelectedProject(null); }}
                            onSuccess={() => {
                                setShowForm(false);
                                setSelectedProject(null);
                                refetch();
                            }}
                        />
                    </div>
                </div>
            )}

            {projects.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project</p>
                        <div className="mt-6">
                            <Button onClick={() => setShowForm(true)}>
                                + Create Project
                            </Button>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            hover
                            onClick={() => window.location.href = `/projects/${project.id}`}
                            className="animate-fade-in"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                    {project.name}
                                </h3>
                                {getStatusBadge(project.status)}
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {project.description || 'No description'}
                            </p>

                            <div className="space-y-2">
                                {project.dueDate && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Due: {format(new Date(project.dueDate), 'MMM dd, yyyy')}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-900">{project.completedTasks || 0}</span>
                                        <span className="text-gray-500"> / {project.taskCount || 0} tasks</span>
                                    </div>

                                    {project.completionRate !== undefined && (
                                        <div className="flex items-center">
                                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${project.completionRate}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">
                                                {Math.round(project.completionRate)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProject(project);
                                        setShowForm(true);
                                    }}
                                >
                                    Edit
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
