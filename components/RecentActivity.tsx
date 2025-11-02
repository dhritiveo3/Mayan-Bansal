
import React, { SVGProps } from 'react';
import type { Activity } from '../types';

const UserPlusIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
);
const ChatBubbleLeftEllipsisIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.425v-2.909c0-4.556 4.03-8.25 9-8.25a9.764 9.764 0 0 1 2.555.337A5.972 5.972 0 0 1 18.59 4.03a5.969 5.969 0 0 1 .474.065 4.48 4.48 0 0 0-.978 2.025c-.09.455-.09.934-.09 1.425v2.909Z" /></svg>
);

const activityIcons: { [key: string]: React.ReactElement } = {
    'New Lead': <UserPlusIcon className="w-5 h-5 text-slate-400" />,
    'Lead Updated': <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-slate-400" />,
    'Follow-up': <UserPlusIcon className="w-5 h-5 text-slate-400" />,
};

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

interface RecentActivityProps {
    activity: Activity[];
    onAddLeadClick: () => void;
}

export default function RecentActivity({ activity, onAddLeadClick }: RecentActivityProps): React.ReactElement {
    return (
        <div className="bg-slate-800 p-6 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                   <p className="mt-1 text-slate-400 text-sm">Live Updates</p>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Feature coming soon!'); }} className="text-sm text-indigo-400 hover:underline">View all &gt;</a>
                    <button onClick={onAddLeadClick} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition-colors">+ Add New Lead</button>
                </div>
            </div>

            <ul className="mt-4 space-y-4">
                {activity.slice(0, 4).map(item => (
                    <li key={item.id} className="flex items-start gap-4 p-3 bg-slate-700/50 rounded-lg">
                        <div className="p-2 bg-slate-800 rounded-full">{activityIcons[item.type]}</div>
                        <div>
                            <p className="text-sm text-slate-300" dangerouslySetInnerHTML={{__html: item.description.replace(/(Mayan Bansal\d*|"[^"]+")/g, '<strong class="font-semibold text-white">$1</strong>')}} />
                            <p className="text-xs text-slate-500">{timeSince(item.timestamp)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
