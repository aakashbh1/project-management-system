import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TASK, UPDATE_TASK } from '../../graphql/mutations';
import { GET_PROJECT_STATS, GET_ALL_TASKS } from '../../graphql/queries';
import { Task } from '../../types';
import { Button } from '../UI/Button';
import { Input, TextArea, Select } from '../UI/FormInputs';

interface TaskFormProps {
    projectId: string;
    task?: Task | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    projectId,
    task,
    onClose,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        assigneeEmail: '',
        dueDate: '',
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                assigneeEmail: task.assigneeEmail,
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            });
        }
    }, [task]);

    const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
        refetchQueries: [
            { query: GET_PROJECT_STATS, variables: { projectId } },
            { query: GET_ALL_TASKS, variables: { projectId } },
        ],
    });
    const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
        refetchQueries: [
            { query: GET_PROJECT_STATS, variables: { projectId: task?.project.id || projectId } },
            { query: GET_ALL_TASKS, variables: { projectId: task?.project.id || projectId } },
        ],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            if (task) {
                const { data } = await updateTask({
                    variables: {
                        id: task.id,
                        ...formData,
                        dueDate: formData.dueDate || null,
                    },
                });

                if (data?.updateTask?.success) {
                    onSuccess();
                } else {
                    setErrors(data?.updateTask?.errors || ['Failed to update task']);
                }
            } else {
                const { data } = await createTask({
                    variables: {
                        projectId,
                        ...formData,
                        dueDate: formData.dueDate || null,
                    },
                });

                if (data?.createTask?.success) {
                    onSuccess();
                } else {
                    setErrors(data?.createTask?.errors || ['Failed to create task']);
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
                    {task ? 'Edit Task' : 'Create New Task'}
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
                    label="Task Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter task title"
                />

                <TextArea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter task description"
                />

                <Select
                    label="Status *"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'TODO', label: 'To Do' },
                        { value: 'IN_PROGRESS', label: 'In Progress' },
                        { value: 'DONE', label: 'Done' },
                    ]}
                />

                <Input
                    label="Assignee Email"
                    name="assigneeEmail"
                    type="email"
                    value={formData.assigneeEmail}
                    onChange={handleChange}
                    placeholder="assignee@example.com"
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
                        {task ? 'Update Task' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
