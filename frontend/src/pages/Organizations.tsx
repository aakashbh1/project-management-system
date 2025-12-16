import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_ORGANIZATIONS } from '../graphql/queries';
import { CREATE_ORGANIZATION } from '../graphql/mutations';
import { Organization } from '../types';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/FormInputs';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { format } from 'date-fns';

interface OrganizationsProps {
    selectedOrg: string | null;
    onSelectOrg: (slug: string) => void;
}

export const Organizations: React.FC<OrganizationsProps> = ({ selectedOrg, onSelectOrg }) => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactEmail: '',
        slug: '',
    });
    const [errors, setErrors] = useState<string[]>([]);

    const { data, loading, refetch } = useQuery(GET_ALL_ORGANIZATIONS);
    const [createOrganization, { loading: creating }] = useMutation(CREATE_ORGANIZATION, {
        refetchQueries: [{ query: GET_ALL_ORGANIZATIONS }],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            const { data: result } = await createOrganization({
                variables: formData,
            });

            if (result?.createOrganization?.success) {
                setFormData({ name: '', contactEmail: '', slug: '' });
                setShowForm(false);
                refetch();
            } else {
                setErrors(result?.createOrganization?.errors || ['Failed to create organization']);
            }
        } catch (error: any) {
            setErrors([error.message]);
        }
    };

    if (loading) return <LoadingSpinner />;

    const organizations: Organization[] = data?.allOrganizations || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
                    <p className="text-gray-600 mt-1">Manage your organizations</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Organization'}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Organization</h2>

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
                            label="Organization Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Acme Corporation"
                        />

                        <Input
                            label="Contact Email *"
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            required
                            placeholder="contact@acme.com"
                        />

                        <Input
                            label="Slug (optional)"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="acme-corp"
                        />

                        <div className="flex justify-end space-x-3">
                            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" loading={creating}>
                                Create Organization
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                    <Card
                        key={org.id}
                        hover
                        onClick={() => {
                            onSelectOrg(org.slug);
                            navigate('/');
                        }}
                        className="cursor-pointer"
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                                    <p className="text-sm text-gray-500">@{org.slug}</p>
                                </div>
                                {org.projectCount !== undefined && (
                                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {org.projectCount} {org.projectCount === 1 ? 'project' : 'projects'}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {org.contactEmail}
                            </div>

                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                                Created {format(new Date(org.createdAt), 'MMM dd, yyyy')}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {organizations.length === 0 && !showForm && (
                <Card>
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first organization</p>
                        <div className="mt-6">
                            <Button onClick={() => setShowForm(true)}>
                                + Create Organization
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
