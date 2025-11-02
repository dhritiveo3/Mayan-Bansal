import React from 'react';

const WrenchScrewdriverIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9h-9v9ZM3 12a9 9 0 0 1 9-9v9H3Zm0 0a9 9 0 0 0 9 9v-9H3Z" />
    </svg>
);

interface ComingSoonPageProps {
    title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps): React.ReactElement {
    return (
        <div className="flex flex-col items-center justify-center text-center bg-slate-800 p-10 rounded-xl h-full animate-fade-in">
            <WrenchScrewdriverIcon className="w-16 h-16 text-indigo-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-lg text-slate-400">This feature is currently under construction.</p>
            <p className="text-slate-500 mt-1">Check back soon for updates!</p>
        </div>
    );
}
