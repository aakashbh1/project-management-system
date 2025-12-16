import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { ProjectList } from './components/Projects/ProjectList';
import { ProjectDetail } from './pages/ProjectDetail';
import { Organizations } from './pages/Organizations';

function App() {
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

    return (
        <ApolloProvider client={apolloClient}>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Header />
                    <div className="flex">
                        <Sidebar selectedOrg={selectedOrg} onSelectOrg={setSelectedOrg} />
                        <main className="flex-1 p-8">
                            <Routes>
                                <Route path="/" element={<ProjectList organizationSlug={selectedOrg} />} />
                                <Route path="/projects/:id" element={<ProjectDetail />} />
                                <Route path="/organizations" element={<Organizations selectedOrg={selectedOrg} onSelectOrg={setSelectedOrg} />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
