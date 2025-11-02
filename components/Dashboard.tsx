import React from 'react';
import StatsGrid from './StatsGrid';
import RecentActivity from './RecentActivity';
import TodaysOverview from './TodaysOverview';
import AiInsights from './AiInsights';
import AiChat from './AiChat';
import type { Lead, Activity } from '../types';

interface DashboardProps {
    leads: Lead[];
    activity: Activity[];
    onAddLeadClick: () => void;
    addLead: (leadData: Partial<Omit<Lead, 'id' | 'added' | 'status'>>) => void;
}

export default function Dashboard({ leads, activity, onAddLeadClick, addLead }: DashboardProps): React.ReactElement {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <StatsGrid leads={leads} />
                <RecentActivity activity={activity} onAddLeadClick={onAddLeadClick} />
                <AiChat addLead={addLead} onAddLeadClick={onAddLeadClick} />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <TodaysOverview leads={leads} />
                <AiInsights leads={leads} />
            </div>
        </div>
    );
}
