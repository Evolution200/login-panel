import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';
import { UserReadProfilePhotoMessage } from 'Plugins/UserAPI/UserReadProfilePhotoMessage';
import { UserEditProfilePhotoMessage } from 'Plugins/UserAPI/UserEditProfilePhotoMessage';
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
    const [profilePhoto, setProfilePhoto] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadUserInfo();
        loadProfilePhoto();
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

    const loadProfilePhoto = async () => {
        try {
            const response = await SendPostRequest(new UserReadProfilePhotoMessage(username));
            if (response && response.data) {
                setProfilePhoto(response.data);
            } else {
                setProfilePhoto('');
            }
        } catch (error) {
            console.error('Failed to load profile photo:', error);
            setErrorMessage('Failed to load profile photo. Please try again later.');
            setProfilePhoto('');
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setErrorMessage('');
            try {
                const base64String = await convertFileToBase64(file);
                const response = await SendPostRequest(new UserEditProfilePhotoMessage(username, base64String));
                if (response && response.data === "OK") {
                    await loadProfilePhoto(); // 重新加载头像
                    setErrorMessage('');
                } else {
                    setErrorMessage('Failed to upload profile photo. Please try again.');
                }
            } catch (error) {
                console.error('Error uploading profile photo:', error);
                setErrorMessage('An error occurred while uploading the profile photo. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <UserLayout>
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">User Information</h2>
                        <p className="mt-1 text-xl text-white opacity-80">Manage your personal details</p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{errorMessage}</span>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center space-x-8 mb-6">
                            <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-full">
                                <img
                                    src={`data:image/png;base64,${profilePhoto}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="photo-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center transition duration-150 ease-in-out">
                                    Upload New Photo
                                </label>
                                <input id="photo-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </div>
                        </div>

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
                </div>
            </div>
        </UserLayout>
    );
}