
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LeadsPage from './pages/LeadsPage';
import ComingSoonPage from './pages/ComingSoonPage';
import LoginPage from './pages/LoginPage';
import AddLeadModal from './components/AddLeadModal';
import { initialLeads, initialActivity } from './constants';
import type { Lead, Activity } from './types';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({ name: 'Mayan' }); // Default user
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [activity, setActivity] = useState<Activity[]>(initialActivity);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

    const handleLogin = (username: string) => {
        setUser({ name: username });
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser({ name: '' });
    };

    const addLead = (leadData: Omit<Lead, 'id' | 'added' | 'status'>) => {
        const newLead: Lead = {
            id: Date.now(),
            name: leadData.name || 'Unnamed Lead',
            email: leadData.email || '',
            phone: leadData.phone || '',
            value: leadData.value || 0,
            status: 'New',
            added: new Date(),
        };
        setLeads(prev => [newLead, ...prev]);
        setActivity(prev => [{
            id: Date.now(),
            type: 'New Lead',
            description: `New lead added: ${newLead.name}`,
            timestamp: new Date(),
            user: user.name,
        }, ...prev]);
        setIsAddLeadModalOpen(false);
    };

    const updateLead = (updatedLead: Lead) => {
        setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
        setActivity(prev => [{
            id: Date.now(),
            type: 'Lead Updated',
            description: `Lead "${updatedLead.name}" status changed to ${updatedLead.status}`,
            timestamp: new Date(),
            user: 'AI Assistant', // Or user.name
        }, ...prev]);
    };

    const deleteLead = (id: number) => {
        const leadToDelete = leads.find(l => l.id === id);
        if (leadToDelete) {
             setLeads(prev => prev.filter(lead => lead.id !== id));
             setActivity(prev => [{
                id: Date.now(),
                type: 'Lead Updated', // Or 'Lead Deleted' if we add it
                description: `Lead "${leadToDelete.name}" was deleted.`,
                timestamp: new Date(),
                user: user.name,
            }, ...prev]);
        }
    };
    
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard leads={leads} activity={activity} onAddLeadClick={() => setIsAddLeadModalOpen(true)} addLead={addLead} />;
            case 'leads':
                return <LeadsPage leads={leads} onAddLeadClick={() => setIsAddLeadModalOpen(true)} updateLead={updateLead} deleteLead={deleteLead} />;
            case 'tasks':
            case 'calendar':
            case 'reports':
            case 'settings':
                return <ComingSoonPage title={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} />;
            default:
                return <Dashboard leads={leads} activity={activity} onAddLeadClick={() => setIsAddLeadModalOpen(true)} addLead={addLead} />;
        }
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="bg-slate-900 text-slate-300 min-h-screen font-sans">
            <div className="flex">
                <Sidebar 
                    currentPage={currentPage} 
                    onNavigate={setCurrentPage} 
                    onLogout={handleLogout}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
                    <Header 
                        username={user.name} 
                        onMenuClick={() => setIsSidebarOpen(true)}
                        onAddLeadClick={() => setIsAddLeadModalOpen(true)} 
                    />
                    <div className="mt-8">
                        {renderPage()}
                    </div>
                </main>
            </div>
            <AddLeadModal 
                isOpen={isAddLeadModalOpen}
                onClose={() => setIsAddLeadModalOpen(false)}
                onAddLead={addLead}
            />
        </div>
    );
}

export default App;
