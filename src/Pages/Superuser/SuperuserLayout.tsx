import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';

interface SuperuserLayoutProps {
    children: React.ReactNode;
    currentPage: 'main' | 'management';
}

export function SuperuserLayout({ children, currentPage }: SuperuserLayoutProps) {
    const history = useHistory();
    const { username, role, clearUser } = useUserStore();

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative">
            {/* 背景图案 */}
            <div className="absolute inset-0 z-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                    <path
                        d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                        fill="currentColor" />
                </svg>
            </div>

            <div className="relative z-10">
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
                                <span className="text-indigo-100">Welcome, {username}!</span>
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
                                onClick={() => history.push("/SuperuserMain")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${currentPage === 'main' ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                MainPage
                            </button>
                            <button
                                onClick={() => history.push("/SuperuserMain/SuperuserManagement")}
                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${currentPage === 'management' ? 'bg-indigo-100 text-indigo-900 shadow-inner' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'} transition duration-150 ease-in-out`}
                            >
                                Authority Management
                            </button>
                        </nav>
                    </aside>
                    <main
                        className="flex-1 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg border border-indigo-100 overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}