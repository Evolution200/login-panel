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
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Socratic</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Username: {username}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <aside className="w-64 pr-8">
                    <nav className="space-y-1">
                        <button
                            onClick={() => history.push("/UserMain")}
                            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain") ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            Main Page
                        </button>
                        <button
                            onClick={() => history.push("/UserMain/UserSubmitArticle")}
                            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain/SubmitArticle") ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            Submit Article
                        </button>
                        <button
                            onClick={() => history.push("/UserMain/UserInfo")}
                            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${isActive("/UserMain/UserInfo") ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            Personal Information
                        </button>
                    </nav>
                </aside>
                <main className="flex-1 bg-white p-8 rounded-lg shadow-md">
                    {children}
                </main>
            </div>
        </div>
    );
}