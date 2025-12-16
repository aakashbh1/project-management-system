import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS } from '../../graphql/queries';
import { ADD_COMMENT } from '../../graphql/mutations';
import { TaskComment } from '../../types';
import { Button } from '../UI/Button';
import { TextArea, Input } from '../UI/FormInputs';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { format } from 'date-fns';

interface CommentSectionProps {
    taskId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
    const [content, setContent] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const { data, loading, refetch } = useQuery(GET_TASK_COMMENTS, {
        variables: { taskId },
    });

    const [addComment, { loading: submitting }] = useMutation(ADD_COMMENT);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        if (!content.trim() || !authorEmail.trim()) {
            setErrors(['Please fill in all fields']);
            return;
        }

        try {
            const { data: result } = await addComment({
                variables: {
                    taskId,
                    content: content.trim(),
                    authorEmail: authorEmail.trim(),
                },
            });

            if (result?.addComment?.success) {
                setContent('');
                refetch();
            } else {
                setErrors(result?.addComment?.errors || ['Failed to add comment']);
            }
        } catch (error: any) {
            setErrors([error.message]);
        }
    };

    if (loading) return <LoadingSpinner size="sm" />;

    const comments: TaskComment[] = data?.taskComments || [];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
                Comments ({comments.length})
            </h3>

            {/* Comment List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {comment.authorEmail.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {comment.authorEmail}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add a Comment</h4>

                {errors.length > 0 && (
                    <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <ul className="list-disc list-inside text-sm text-red-800">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Input
                    label="Your Email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                />

                <TextArea
                    label="Comment"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    placeholder="Write your comment..."
                    required
                />

                <div className="flex justify-end">
                    <Button type="submit" loading={submitting}>
                        Post Comment
                    </Button>
                </div>
            </form>
        </div>
    );
};
