import React from 'react';
import { useUserStore } from '../../Store/UserStore';
import { SuperuserLayout } from './SuperuserLayout';

export function SuperuserMainPage() {
    const { username } = useUserStore();

    return (
        <SuperuserLayout currentPage="main">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Welcome to the Main Page, {username}!</h2>
            <p className="text-gray-600">Use the sidebar to navigate to other pages.</p>
        </SuperuserLayout>
    );
}