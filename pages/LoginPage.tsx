
import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps): React.ReactElement {
    const [username, setUsername] = useState('Mayan');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && password.trim()) {
            onLogin(username);
        } else {
            setError('Please enter both username and password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
            <div className="w-full max-w-sm p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-indigo-600 rounded-lg inline-block">
                        <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3m-16.5 0h16.5m-16.5 0H3.75m16.5 0h.008v.008h-.008V3Zm-1.5 6h.008v.008h-.008V9Zm-1.5 0h.008v.008h-.008V9Zm-1.5 0h.008v.008h-.008V9Zm-1.5 0h.008v.008h-.008V9Zm-1.5 0h.008v.008h-.008V9Zm-1.5 0h.008v.008h-.008V9Zm-1.5 0h.008v.008h-.008V9Z" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome to LeadGenius</h1>
                    <p className="mt-2 text-slate-400">Sign in to continue</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Mayan"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors"
                        >
                            Sign in
                        </button>
                    </div>
                     <p className="text-center text-xs text-slate-500">
                        Use any username/password to continue.
                    </p>
                </form>
            </div>
        </div>
    );
}
