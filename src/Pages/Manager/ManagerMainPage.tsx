import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ManagerLayout } from './ManagerLayout';
import { useUserStore } from '../../Store/UserStore';
import { usePeriodicalStore } from '../../Store/PeriodicalStore';
import { useManagerStore } from '../../Store/ManagerStore';

export function ManagerMainPage() {
    const { username } = useUserStore();
    const { fetchPeriodicals } = usePeriodicalStore();
    const { pendingApplications, stats, loadPendingApplications, updateStats } = useManagerStore();
    const history = useHistory();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await Promise.all([fetchPeriodicals(), loadPendingApplications()]);
        updateStats();
    };

    const navigateToManagerManagement = () => {
        history.push("/ManagerMain/ManagerManagement");
    };

    const navigateToPeriodicalList = () => {
        history.push("/ManagerMain/PeriodicalList");
    };

    return (
        <ManagerLayout currentPage="main">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to the Manager Dashboard, {username}!</h2>

                <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Statistics</h3>
                        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Periodicals</dt>
                                <dd className="mt-1 text-3xl font-semibold text-indigo-600">{stats.totalPeriodicals}</dd>
                            </div>
                            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Editors</dt>
                                <dd className="mt-1 text-3xl font-semibold text-indigo-600">{stats.totalEditors}</dd>
                            </div>
                            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Pending Applications</dt>
                                <dd className="mt-1 text-3xl font-semibold text-indigo-600">{stats.pendingApplications}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
                        <div className="mt-5">
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {pendingApplications.slice(0, 5).map((application, index) => (
                                        <li key={index}>
                                            <div className="relative pb-8">
                                                {index !== 4 ? (
                                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                ) : null}
                                                <div className="relative flex space-x-3">
                                                    <div>
                                                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">New editor application from <span className="font-medium text-gray-900">{application.userName}</span></p>
                                                        </div>
                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                            <time dateTime="2020-09-20">Pending</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {pendingApplications.length > 5 && (
                                <div className="mt-6">
                                    <button onClick={navigateToManagerManagement} className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        View all
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <button onClick={navigateToManagerManagement} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Manage Editor Applications
                                </button>
                            </div>
                            <div>
                                <button onClick={navigateToPeriodicalList} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    View Periodical List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}