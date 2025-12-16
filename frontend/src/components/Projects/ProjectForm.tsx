import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT, UPDATE_PROJECT } from '../../graphql/mutations';
import { GET_ALL_ORGANIZATIONS, GET_ALL_PROJECTS } from '../../graphql/queries';
import { Project } from '../../types';
import { Button } from '../UI/Button';
import { Input, TextArea, Select } from '../UI/FormInputs';

interface ProjectFormProps {
    organizationSlug: string;
    project?: Project | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
    organizationSlug,
    project,
    onClose,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE',
        dueDate: '',
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description,
                status: project.status,
                dueDate: project.dueDate || '',
            });
        }
    }, [project]);

    const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT, {
        refetchQueries: [
            { query: GET_ALL_ORGANIZATIONS },
            { query: GET_ALL_PROJECTS, variables: { organizationSlug } },
        ],
    });

    const [updateProject, { loading: updating }] = useMutation(UPDATE_PROJECT, {
        refetchQueries: [
            { query: GET_ALL_ORGANIZATIONS },
            { query: GET_ALL_PROJECTS, variables: { organizationSlug: project?.organization.slug || organizationSlug } },
        ],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            if (project) {
                const { data } = await updateProject({
                    variables: {
                        id: project.id,
                        ...formData,
                        dueDate: formData.dueDate || null,
                    },
                });

                if (data?.updateProject?.success) {
                    onSuccess();
                } else {
                    setErrors(data?.updateProject?.errors || ['Failed to update project']);
                }
            } else {
                const { data } = await createProject({
                    variables: {
                        organizationSlug,
                        ...formData,
                        dueDate: formData.dueDate || null,
                    },
                });

                if (data?.createProject?.success) {
                    onSuccess();
                } else {
                    setErrors(data?.createProject?.errors || ['Failed to create project']);
                }
            }
        } catch (error: any) {
            setErrors([error.message]);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {project ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {errors.length > 0 && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="list-disc list-inside text-sm text-red-800">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Project Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter project name"
                />

                <TextArea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter project description"
                />

                <Select
                    label="Status *"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'ACTIVE', label: 'Active' },
                        { value: 'COMPLETED', label: 'Completed' },
                        { value: 'ON_HOLD', label: 'On Hold' },
                    ]}
                />

                <Input
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                />

                <div className="flex justify-end space-x-3 mt-6">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={creating || updating}>
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
