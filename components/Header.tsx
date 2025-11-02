
import React, { SVGProps } from 'react';

const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);
const DocumentPlusIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
);
const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" /></svg>
);
const Bars3Icon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
);

interface HeaderProps {
    username: string;
    onMenuClick: () => void;
    onAddLeadClick: () => void;
}

export default function Header({ username, onMenuClick, onAddLeadClick }: HeaderProps): React.ReactElement {
    const handleComingSoon = () => {
        alert('This feature is coming soon!');
    };

    return (
        <header>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Good evening, {username}!</h2>
                    <p className="mt-1 text-slate-400">Here's what's happening with your leads today</p>
                </div>
                <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-slate-700" aria-label="Open menu">
                    <Bars3Icon className="w-6 h-6"/>
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button onClick={onAddLeadClick} className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Lead</span>
                    </button>
                    <button onClick={handleComingSoon} className="flex items-center justify-center gap-2 p-3 bg-slate-700 text-slate-300 font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
                        <DocumentPlusIcon className="w-5 h-5" />
                        <span>Add Task</span>
                    </button>
                    <button onClick={handleComingSoon} className="flex items-center justify-center gap-2 p-3 bg-slate-700 text-slate-300 font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
                        <CalendarIcon className="w-5 h-5" />
                        <span>Schedule Meeting</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
