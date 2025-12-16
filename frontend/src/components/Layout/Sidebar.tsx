import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { GET_ALL_ORGANIZATIONS } from '../../graphql/queries';
import { Organization } from '../../types';

interface SidebarProps {
    selectedOrg: string | null;
    onSelectOrg: (slug: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedOrg, onSelectOrg }) => {
    const { data, loading } = useQuery(GET_ALL_ORGANIZATIONS);
    const navigate = useNavigate();
    const location = useLocation();

    const handleOrgClick = (slug: string) => {
        onSelectOrg(slug);
        // Navigate to dashboard if not already there
        if (location.pathname !== '/') {
            navigate('/');
        }
    };

    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
            <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Organizations
                </h2>

                {loading ? (
                    <div className="text-sm text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-1">
                        {data?.allOrganizations?.map((org: Organization) => (
                            <button
                                key={org.id}
                                onClick={() => handleOrgClick(org.slug)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedOrg === org.slug
                                        ? 'bg-primary-100 text-primary-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{org.name}</span>
                                    {org.projectCount !== undefined && (
                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                            {org.projectCount}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};
