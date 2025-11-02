import React, { SVGProps } from 'react';
import type { Lead } from '../types';

const SparklesIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
);
const ExclamationTriangleIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
);

interface AiInsightsProps {
    leads: Lead[];
}

export default function AiInsights({ leads }: AiInsightsProps): React.ReactElement {
    const unattendedLeadsCount = leads.filter(lead => lead.status === 'Unattended').length;

    return (
        <div className="bg-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500/20 rounded-md">
                    <SparklesIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Insights & Alerts</h3>
            </div>
            {unattendedLeadsCount > 0 && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300 font-medium">{unattendedLeadsCount} {unattendedLeadsCount === 1 ? 'lead needs' : 'leads need'} immediate attention</p>
                </div>
            )}
             {unattendedLeadsCount === 0 && (
                <div className="mt-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg">
                    <p className="text-sm text-green-300 font-medium">All leads are attended to. Great job!</p>
                </div>
            )}
        </div>
    );
}
