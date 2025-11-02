import React, { SVGProps } from 'react';
import type { Lead } from '../types';

const UserGroupIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.56-1.621 1.621-2.962 2.962-3.845-1.341-.883-2.402-2.224-2.962-3.845m-7.5 2.962 7.5-2.962m7.5 2.962-7.5 2.962m0-6.212-7.5-2.962" /></svg>
);
const ExclamationTriangleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);
const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const FireIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 3.75 3.75 0 0 0-7.493 0A3.75 3.75 0 0 0 12 18Z" /></svg>
);

const OverviewCard: React.FC<{ icon: React.ReactElement, title: string, subtitle: string, value: number }> = ({ icon, title, subtitle, value }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-sm text-slate-300">{title}</p>
                <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
);

interface TodaysOverviewProps {
    leads: Lead[];
}

export default function TodaysOverview({ leads }: TodaysOverviewProps): React.ReactElement {
    const today = new Date();
    today.setHours(0,0,0,0);

    const newLeadsToday = leads.filter(l => l.added >= today).length;
    const unattendedLeads = leads.filter(l => l.status === 'Unattended').length;
    const followUps = leads.filter(l => l.status === 'Follow-up').length;
    const hotLeads = leads.filter(l => l.status === 'Hot').length;


    const overviewData = [
        { icon: <UserGroupIcon className="w-5 h-5 text-slate-400" />, title: "New Leads", subtitle: "Added today", value: newLeadsToday },
        { icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />, title: "Unattended", subtitle: "Needs attention", value: unattendedLeads },
        { icon: <ClockIcon className="w-5 h-5 text-slate-400" />, title: "Follow-ups", subtitle: "Action required", value: followUps },
        { icon: <FireIcon className="w-5 h-5 text-red-400" />, title: "High-Intent", subtitle: "Focus on nurturing", value: hotLeads },
    ];
    return (
        <div className="bg-slate-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white">Today's Overview</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
                {overviewData.map(data => <OverviewCard key={data.title} {...data} />)}
            </div>
        </div>
    );
}
