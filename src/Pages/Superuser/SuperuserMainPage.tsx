import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';
import { SuperuserLayout } from './SuperuserLayout';

export function SuperuserMainPage() {
    const { username } = useUserStore();
    const history = useHistory();

    return (
        <SuperuserLayout currentPage="main">
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">
                            Welcome back, {username}!
                        </h2>
                        <p className="mt-1 text-xl text-white opacity-80">
                            Ready to manage the system?
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <button
                                onClick={() => history.push("/SuperuserMain/SuperuserManagement")}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Manage Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SuperuserLayout>
    );
}