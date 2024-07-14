import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';

interface EditorLayoutProps {
    children: React.ReactNode;
    currentPage: 'main' | 'info';
}

export function EditorLayout({ children, currentPage }: EditorLayoutProps) {
    const history = useHistory();
    const { username, role, clearUser } = useUserStore();

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="min-h-screen flex flex-col">
                <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <svg className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h1 className="text-3xl font-bold">Socratic</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-indigo-100">Welcome, {username}</span>
                                <span className="px-2 py-1 bg-indigo-700 rounded-full text-xs font-medium">{role}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-grow flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <aside className="w-64 pr-8">
                        <nav className="space-y-1">
                            <button
                                onClick={() => history.push("/EditorMain")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${currentPage === 'main' ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                MainPage
                            </button>
                            <button
                                onClick={() => history.push("/EditorMain/EditorInfo")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${currentPage === 'info' ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                Editor Information
                            </button>
                        </nav>
                    </aside>
                    <main className="flex-1 bg-white rounded-lg shadow-lg border border-indigo-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white">
                            <h2 className="text-xl font-semibold">
                                {currentPage === 'main' ? 'Editor Dashboard' : 'Editor Information'}
                            </h2>
                        </div>
                        <div className="p-6">
                            {children}
                        </div>
                    </main>
                </div>

                <footer className="bg-indigo-800 text-white py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                        © 2024 Socratic. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
}