import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_TASKS } from '../../graphql/queries';
import { UPDATE_TASK } from '../../graphql/mutations';
import { Task } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { TaskForm } from './TaskForm';
import { format } from 'date-fns';

interface TaskBoardProps {
    projectId: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
    const [showForm, setShowForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const { data, loading, error, refetch } = useQuery(GET_ALL_TASKS, {
        variables: { projectId },
    });

    const [updateTask] = useMutation(UPDATE_TASK);

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await updateTask({
                variables: { id: taskId, status: newStatus },
            });
            refetch();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-600">Error: {error.message}</div>;

    const tasks: Task[] = data?.allTasks || [];
    const todoTasks = tasks.filter(t => t.status === 'TODO');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const doneTasks = tasks.filter(t => t.status === 'DONE');

    const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
        <Card className="mb-3 cursor-pointer" hover>
            <div className="space-y-2">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                )}

                {task.assigneeEmail && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {task.assigneeEmail}
                    </div>
                )}

                {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(task.dueDate), 'MMM dd')}
                    </div>
                )}

                {task.commentCount !== undefined && task.commentCount > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        {task.commentCount} {task.commentCount === 1 ? 'comment' : 'comments'}
                    </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                            setShowForm(true);
                        }}
                    >
                        Edit
                    </Button>
                </div>
            </div>
        </Card>
    );

    const Column: React.FC<{
        title: string;
        tasks: Task[];
        status: string;
        color: string;
    }> = ({ title, tasks, status, color }) => (
        <div className="flex-1 min-w-[300px]">
            <div className={`${color} rounded-t-lg px-4 py-3`}>
                <h3 className="font-semibold text-white flex items-center justify-between">
                    {title}
                    <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-sm">
                        {tasks.length}
                    </span>
                </h3>
            </div>
            <div className="bg-gray-50 rounded-b-lg p-4 min-h-[400px]">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
                <Button onClick={() => { setSelectedTask(null); setShowForm(true); }}>
                    + New Task
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <TaskForm
                            projectId={projectId}
                            task={selectedTask}
                            onClose={() => { setShowForm(false); setSelectedTask(null); }}
                            onSuccess={() => {
                                setShowForm(false);
                                setSelectedTask(null);
                                refetch();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-6 overflow-x-auto pb-4">
                <Column
                    title="To Do"
                    tasks={todoTasks}
                    status="TODO"
                    color="bg-gray-600"
                />
                <Column
                    title="In Progress"
                    tasks={inProgressTasks}
                    status="IN_PROGRESS"
                    color="bg-blue-600"
                />
                <Column
                    title="Done"
                    tasks={doneTasks}
                    status="DONE"
                    color="bg-green-600"
                />
            </div>
        </div>
    );
};
