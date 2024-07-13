import React, { useState, useEffect } from 'react';
import { Application, fetchApplications } from '../../Common/FetchApplication';
import { FinishManagerMessage } from 'Plugins/SuperuserAPI/FinishManagerMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { ReadTasksMessage } from 'Plugins/SuperuserAPI/ReadTasksMessage';
import { SuperuserLayout } from './SuperuserLayout';

export function SuperuserManagementPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const message = new ReadTasksMessage();
            const data = await fetchApplications(message);
            setApplications(data);
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to load applications:', error);
            setErrorMessage('Failed to load applications. Please try again later.');
        }
    };

    const sendFinishManagerMessage = async (userName: string, allowed: boolean) => {
        const message = new FinishManagerMessage(userName, allowed);
        try {
            const response = await SendPostRequest(message);
            if (response && response.data) {
                return response.data;
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Failed to send FinishManagerMessage:', error);
            throw error;
        }
    };

    const handleApprove = async (userName: string) => {
        try {
            await sendFinishManagerMessage(userName, true);
            setErrorMessage('');
            await loadApplications(); // 重新加载应用列表
        } catch (error) {
            console.error('Failed to approve application:', error);
            setErrorMessage('Failed to approve application. Please try again later.');
        }
    };

    const handleReject = async (userName: string) => {
        try {
            await sendFinishManagerMessage(userName, false);
            setErrorMessage('');
            await loadApplications(); // 重新加载应用列表
        } catch (error) {
            console.error('Failed to reject application:', error);
            setErrorMessage('Failed to reject application. Please try again later.');
        }
    };

    return (
        <SuperuserLayout currentPage="management">
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manager Applications</h2>
                </div>
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}
                {applications.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No.
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((application, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {application.userName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleApprove(application.userName)}
                                            className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(application.userName)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No applications available.</p>
                )}
            </div>
        </SuperuserLayout>
    );
}