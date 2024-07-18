import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';

interface EditorLayoutProps {
    children: React.ReactNode;
    currentPage: 'main' | 'info' | 'articles' | 'search';
}

export function EditorLayout({ children, currentPage }: EditorLayoutProps) {
    const history = useHistory();
    const { username, role, clearUser } = useUserStore();

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    const navItems = [
        { name: 'MainPage', path: '/EditorMain', id: 'main' },
        { name: 'Editor Information', path: '/EditorMain/EditorInfo', id: 'info' },
        { name: 'Journal Articles', path: '/EditorMain/EditorArticles', id: 'articles' },
        { name: 'Search Articles', path: '/ArticleSearch', id: 'search' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <div className="min-h-screen flex flex-col">
                <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <svg width="48px" height="48px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path className="a"
                                          d="M13.0875,22.4959V4.5l3.7377,3.738H33.3l3.4854-3.4858v6.9913m0,7.75v7.3452a11.7786,11.7786,0,0,1-11.8023,11.63H13.0883v-3.148"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a"
                                          d="M13.0875,22.3336l-6.11,13.0756s4.9271,2.8562,8.1977-2.7955L17.18,33.32s2.9225-7.83-4.0928-10.9875Z"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M36.7858,26.8386l4.2367,8.695s-4.13,1.9434-7.0176-1.2319"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M18.8163,38.4691V43.5h2.7823" stroke="#FFFFFF"
                                          strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M24.9835,38.4691V43.5h2.7824" stroke="#FFFFFF"
                                          strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M29.6077,21.3312l-3.5532,2.0516V19.28Z" stroke="#FFFFFF"
                                          strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <circle className="a" cx="20.6008" cy="15.5961" r="5.0056" stroke="#FFFFFF"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <circle className="a" cx="33.2832" cy="15.5961" r="5.0056" stroke="#FFFFFF"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a"
                                          d="M28.2785,15.5961H25.586m-9.9907,0H13.0882a2.1869,2.1869,0,0,0-2.231,2.2312"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M25.8879,26.9683a1.7612,1.7612,0,1,1-3.5224,0"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M31.3564,26.9683a1.7613,1.7613,0,1,1-3.5225,0"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path className="a" d="M28.7876,30.5215a1.7612,1.7612,0,1,1-3.5224,0"
                                          stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <circle className="a" cx="20.6008" cy="15.5961" r="1.8731" stroke="#FFFFFF"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <circle className="a" cx="33.2832" cy="15.5961" r="1.8731" stroke="#FFFFFF"
                                            strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                                <h1 className="text-3xl font-bold">Socratic</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-indigo-100">Welcome, {username}</span>
                                <span className="px-2 py-1 bg-indigo-700 rounded-full text-xs font-medium">{role}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-12 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
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
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => history.push(item.path)}
                                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                                        currentPage === item.id
                                            ? 'bg-indigo-200 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-white hover:text-indigo-900'
                                    } transition duration-150 ease-in-out transform hover:scale-105`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1 bg-white rounded-lg shadow-lg border border-indigo-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white">
                            <h2 className="text-xl font-semibold">
                                {currentPage === 'main' ? 'Editor Dashboard' :
                                    currentPage === 'info' ? 'Editor Information' :
                                        currentPage === 'articles' ? 'Journal Articles' :
                                            'Search Articles'}
                            </h2>
                        </div>
                        <div className="p-6">
                            {children}
                        </div>
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