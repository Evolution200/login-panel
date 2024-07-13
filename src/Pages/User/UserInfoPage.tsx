import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore } from '../../Store/UserStore';
import { UserLayout } from './UserLayout';

interface UserInfoData {
    user_name: string;
    sur_name: string;
    last_name: string;
    institute: string;
    expertise: string;
    email: string;
}

const userProperties: (keyof UserInfoData)[] = ['user_name', 'sur_name', 'last_name', 'institute', 'expertise', 'email'];

const propertyDisplayNames: Record<keyof UserInfoData, string> = {
    user_name: 'Username',
    sur_name: 'First name',
    last_name: 'Last Name',
    institute: 'Institute',
    expertise: 'Expertise',
    email: 'Email'
};

export function UserInfoPage() {
    const history = useHistory();
    const { username } = useUserStore();
    const [userInfo, setUserInfo] = useState<Partial<UserInfoData>>({});
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const infoPromises = userProperties.map(property =>
                SendPostRequest(new UserReadInfoMessage(username, property))
            );
            const results = await Promise.all(infoPromises);

            const newUserInfo: Partial<UserInfoData> = {};
            results.forEach((result, index) => {
                if (result && result.data) {
                    newUserInfo[userProperties[index]] = result.data;
                }
            });

            setUserInfo(newUserInfo);
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to load user info:', error);
            setErrorMessage('Failed to load user information. Please try again later.');
        }
    };

    return (
        <UserLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Information</h2>
                </div>
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}
                {Object.keys(userInfo).length > 0 ? (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Details</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {userProperties.map((prop, index) => (
                                    <div key={prop} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                        <dt className="text-sm font-medium text-gray-500">{propertyDisplayNames[prop]}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userInfo[prop] || 'N/A'}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Loading user information...</p>
                )}
            </div>
        </UserLayout>
    );
}