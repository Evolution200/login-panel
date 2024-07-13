import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';

interface SuperuserLayoutProps {
    children: React.ReactNode;
    currentPage: 'main' | 'management';
}

export function SuperuserLayout({ children, currentPage }: SuperuserLayoutProps) {
    const history = useHistory();
    const { role, clearUser } = useUserStore();

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Socratic</h1>
                    <div className="flex items-center">
                        <span className="mr-4 text-gray-700">Current Role: {role}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </header>
                <div className="flex">
                    <aside className="w-64 pr-8">
                        <nav>
                            <ul className="space-y-2">
                                <li
                                    className={`p-2 rounded cursor-pointer transition duration-300 ${
                                        currentPage === 'main'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    onClick={() => currentPage !== 'main' && history.push("/SuperuserMain")}
                                >
                                    MainPage
                                </li>
                                <li
                                    className={`p-2 rounded cursor-pointer transition duration-300 ${
                                        currentPage === 'management'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                    onClick={() => currentPage !== 'management' && history.push("/SuperuserMain/SuperuserManagement")}
                                >
                                    Authority Management
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}