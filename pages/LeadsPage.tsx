import React, { useState, useMemo } from 'react';
import type { Lead } from '../types';

// Icons
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const MagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>);
const FunnelIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>);

const statusColors: { [key in Lead['status']]: string } = {
    'New': 'bg-blue-500/20 text-blue-300',
    'Hot': 'bg-red-500/20 text-red-300',
    'Follow-up': 'bg-yellow-500/20 text-yellow-300',
    'Converted': 'bg-green-500/20 text-green-300',
    'Unattended': 'bg-gray-500/20 text-gray-300',
};

const LeadStatusBadge: React.FC<{ status: Lead['status'] }> = ({ status }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status}
    </span>
);

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

interface LeadsPageProps {
    leads: Lead[];
    onAddLeadClick: () => void;
    updateLead: (lead: Lead) => void;
    deleteLead: (id: number) => void;
}

export default function LeadsPage({ leads, onAddLeadClick, updateLead, deleteLead }: LeadsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'All'>('All');

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => statusFilter === 'All' || lead.status === statusFilter)
            .filter(lead => lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [leads, searchTerm, statusFilter]);
    
    return (
        <div className="bg-slate-800 p-6 rounded-xl animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold text-white">All Leads ({leads.length})</h3>
                <div className="flex items-center gap-2">
                    <button onClick={onAddLeadClick} className="flex items-center justify-center gap-2 p-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Lead</span>
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="relative w-full sm:max-w-xs">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input type="text" placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                 <div className="relative w-full sm:w-auto">
                    <FunnelIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="appearance-none w-full sm:w-40 bg-slate-700 border border-slate-600 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="All">All Statuses</option>
                        {Object.keys(statusColors).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
                 <div className="min-w-full bg-slate-800 rounded-lg">
                    {/* Header */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-3 text-xs font-semibold text-slate-400 border-b border-slate-700 hidden md:grid">
                        <div className="col-span-2">Lead Name</div>
                        <div>Status</div>
                        <div>Value</div>
                        <div>Date Added</div>
                    </div>
                    {/* Body */}
                     {filteredLeads.length > 0 ? (
                        filteredLeads.map(lead => (
                            <div key={lead.id} className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4 py-4 items-center border-b border-slate-700 text-sm hover:bg-slate-700/50 transition-colors">
                                <div className="md:col-span-2">
                                    <p className="font-semibold text-white">{lead.name}</p>
                                    <p className="text-slate-400 text-xs">{lead.email}</p>
                                </div>
                                 <div className="flex items-center"><span className="md:hidden text-xs text-slate-400 mr-2">Status: </span><LeadStatusBadge status={lead.status} /></div>
                                <div className="flex items-center"><span className="md:hidden text-xs text-slate-400 mr-2">Value: </span><p className="text-white">${lead.value.toLocaleString()}</p></div>
                                <div className="flex items-center col-span-2 md:col-span-1"><span className="md:hidden text-xs text-slate-400 mr-2">Added: </span><p className="text-slate-400">{timeSince(lead.added)}</p></div>
                            </div>
                        ))
                     ) : (
                        <div className="text-center py-8 text-slate-400">
                            No leads found.
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
}
