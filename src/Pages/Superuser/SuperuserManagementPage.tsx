import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../Store/UserStore';
import { SuperuserLayout } from './SuperuserLayout';
import { useHistory } from 'react-router-dom';
import { ReadTasksMessage } from 'Plugins/SuperuserAPI/ReadTasksMessage';
import { FinishManagerMessage } from 'Plugins/SuperuserAPI/FinishManagerMessage';
import { ApplicationManagementPage } from '../../Common/ApplicationManagement';
import { EditPasswordMessage } from 'Plugins/UserManagementAPI/EditPasswordMessage';
import { SendPostRequest } from '../../Common/SendPost';

export function SuperuserManagementPage() {
    const { username } = useUserStore();
    const history = useHistory();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/\d/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/[a-zA-Z]/.test(password)) {
            return 'Password must contain at least one letter';
        }
        if (/[^a-zA-Z0-9]/.test(password)) {
            return 'Password cannot contain special characters';
        }
        return null;
    };

    const handlePasswordChange = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setPasswordError(passwordError);
            return;
        }

        try {
            const response = await SendPostRequest(new EditPasswordMessage(username, currentPassword, newPassword));
            if (response.data === 'OK') {
                setPasswordSuccess('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPasswordError('Failed to update password. Please check your current password and try again.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('An error occurred while updating the password. Please try again.');
        }
    };

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

                {/* 添加密码修改部分 */}
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
                        <div className="mt-5 space-y-4">
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Current Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {passwordError && (
                                <p className="text-sm text-red-600">{passwordError}</p>
                            )}
                            {passwordSuccess && (
                                <p className="text-sm text-green-600">{passwordSuccess}</p>
                            )}
                            <button
                                onClick={handlePasswordChange}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SuperuserLayout>
    );
}