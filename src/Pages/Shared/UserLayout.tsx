import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';

type UserLayoutProps = {
    children: React.ReactNode;
};

export function UserLayout({ children }: UserLayoutProps) {
    const history = useHistory();
    const location = useLocation();
    const { username, clearUser } = useUserStore();

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative flex flex-col">
            {/* 背景图案 */}
            <div className="absolute inset-0 z-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                    <path d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/>
                </svg>
            </div>

            <div className="relative z-10 flex-grow flex flex-col">
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
                                onClick={() => history.push("/UserMain")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain") ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                Main Page
                            </button>
                            <button
                                onClick={() => history.push("/UserMain/UserSubmitArticle")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain/UserSubmitArticle") ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                Submit Article
                            </button>
                            <button
                                onClick={() => history.push("/UserMain/UserPersonalPeriodical")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain/UserPersonalPeriodical") ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                My Articles
                            </button>
                            <button
                                onClick={() => history.push("/UserMain/UserInfo")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain/UserInfo") ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                Personal Information
                            </button>
                        </nav>
                    </aside>
                    <main
                        className="flex-1 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg border border-indigo-100 overflow-hidden">
                        {children}
                    </main>
                </div>

                <footer className="bg-indigo-800 text-white py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                        © {new Date().getFullYear()} Socratic. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
}