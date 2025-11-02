
import React, { SVGProps } from 'react';
import type { Lead } from '../types';

const UserGroupIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962c.56-1.621 1.621-2.962 2.962-3.845-1.341-.883-2.402-2.224-2.962-3.845m-7.5 2.962 7.5-2.962m7.5 2.962-7.5 2.962m0-6.212-7.5-2.962" /></svg>
);
const FireIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 3.75 3.75 0 0 0-7.493 0A3.75 3.75 0 0 0 12 18Z" /></svg>
);
const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);
const ArrowTrendingUpIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>
);
const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" /></svg>
);


// FIX: Specify that icon prop accepts className and style to resolve React.cloneElement type error.
const StatCard: React.FC<{ icon: React.ReactElement<{ className?: string, style?: React.CSSProperties }>, title: string, value: number, subtitle: string, color: string }> = ({ icon, title, value, subtitle, color }) => (
  <div className={`bg-slate-800 p-5 rounded-xl border-t-4 ${color}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      {React.cloneElement(icon, { className: 'w-8 h-8 p-1.5 rounded-lg', style: { backgroundColor: `${color.replace('border', 'bg').replace(']', '-500/20]')}`, color: `${color.replace('border', 'text')}` } })}
    </div>
    <div className="mt-2">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </div>
);

interface StatsGridProps {
    leads: Lead[];
}

export default function StatsGrid({ leads }: StatsGridProps): React.ReactElement {
    const totalLeads = leads.length;
    const newLeadsThisWeek = leads.filter(l => (new Date().getTime() - l.added.getTime()) < 7 * 24 * 60 * 60 * 1000).length;
    const hotLeads = leads.filter(l => l.status === 'Hot').length;
    const followUps = leads.filter(l => l.status === 'Follow-up').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;


    const stats = [
        { icon: <UserGroupIcon />, title: "Total Leads", value: totalLeads, subtitle: `+${newLeadsThisWeek} this week`, color: "border-blue-500" },
        { icon: <FireIcon />, title: "Hot Leads", value: hotLeads, subtitle: "High priority", color: "border-red-500" },
        { icon: <ClockIcon />, title: "Follow-Ups", value: followUps, subtitle: "Action required", color: "border-yellow-500" },
        { icon: <ArrowTrendingUpIcon />, title: "Converted Leads", value: convertedLeads, subtitle: "Recently closed", color: "border-green-500" },
        { icon: <CalendarIcon />, title: "Upcoming Meetings", value: 0, subtitle: "No meetings scheduled", color: "border-purple-500" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>
    );
}