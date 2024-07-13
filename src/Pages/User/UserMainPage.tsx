import React from 'react';
import { useUserStore } from '../../Store/UserStore';
import { UserLayout } from './UserLayout';

export function UserMainPage() {
    const { username } = useUserStore();

    return (
        <UserLayout>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to the Main Page, {username}!</h2>
                <p className="text-gray-600">Use the sidebar to navigate to other pages.</p>
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <p className="font-bold">Info</p>
                    <p>This is your personal dashboard. You can submit articles, view your information, and manage your tasks from here.</p>
                </div>
            </div>
        </UserLayout>
    );
}
