import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';
import { UserReadProfilePhotoMessage } from 'Plugins/UserAPI/UserReadProfilePhotoMessage';
import { UserEditProfilePhotoMessage } from 'Plugins/UserAPI/UserEditProfilePhotoMessage';
import { UserEditInfoMessage } from 'Plugins/UserAPI/UserEditInfoMessage';
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
    password: string;
}

const userProperties: (keyof UserInfoData)[] = ['user_name', 'sur_name', 'last_name', 'institute', 'expertise', 'email'];

const propertyDisplayNames: Record<keyof UserInfoData, string> = {
    user_name: 'Username',
    sur_name: 'First name',
    last_name: 'Last Name',
    institute: 'Institute',
    expertise: 'Expertise',
    email: 'Email',
    password: 'Password'
};

export function UserInfoPage() {
    const history = useHistory();
    const { username } = useUserStore();
    const [userInfo, setUserInfo] = useState<Partial<UserInfoData>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [editMode, setEditMode] = useState<keyof UserInfoData | null>(null);
    const [editValue, setEditValue] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
                    await loadProfilePhoto();
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

    const handleEdit = (property: keyof UserInfoData) => {
        setEditMode(property);
        setEditValue(userInfo[property] || '');
        if (property === 'password') {
            setCurrentPassword('');
            setNewPassword('');
        }
    };

    const handleSave = async () => {
        if (!editMode) return;

        try {
            if (editMode === 'password') {
                // 验证当前密码
                const passwordResponse = await SendPostRequest(new UserReadInfoMessage(username, 'password'));
                if (passwordResponse.data !== currentPassword) {
                    setErrorMessage('Current password is incorrect');
                    return;
                }
                // 更新密码
                const response = await SendPostRequest(new UserEditInfoMessage(username, 'password', newPassword));
                if (response.data === 'OK') {
                    setUserInfo(prev => ({ ...prev, password: '********' }));
                    setEditMode(null);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Failed to update password. Please try again.');
                }
            } else {
                // 更新其他字段
                const response = await SendPostRequest(new UserEditInfoMessage(username, editMode, editValue));
                if (response.data === 'OK') {
                    setUserInfo(prev => ({ ...prev, [editMode]: editValue }));
                    setEditMode(null);
                    setErrorMessage('');
                } else {
                    setErrorMessage(`Failed to update ${propertyDisplayNames[editMode]}. Please try again.`);
                }
            }
        } catch (error) {
            console.error(`Error updating ${editMode}:`, error);
            setErrorMessage(`An error occurred while updating ${propertyDisplayNames[editMode]}. Please try again.`);
        }
    };

    const handleCancel = () => {
        setEditMode(null);
        setEditValue('');
        setCurrentPassword('');
        setNewPassword('');
    };

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto space-y-8 p-6">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">User Profile</h2>
                        <p className="mt-1 text-xl text-white opacity-80">Manage your personal information</p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
                            <div className="flex-shrink-0 w-40 h-40 rounded-full overflow-hidden shadow-lg">
                                <img
                                    src={`data:image/png;base64,${profilePhoto}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-2xl font-semibold text-gray-800">{userInfo.sur_name} {userInfo.last_name}</h3>
                                <p className="text-gray-600">{userInfo.email}</p>
                                <label htmlFor="photo-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out inline-block text-center transform hover:scale-105">
                                    Update Profile Picture
                                </label>
                                <input id="photo-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-xl font-semibold text-gray-700 mb-8">Personal Information</h4>
                            <dl className="space-y-8">
                                {userProperties.map((prop) => (
                                    <div key={prop} className="flex flex-col sm:flex-row sm:justify-between">
                                        <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">{propertyDisplayNames[prop]}</dt>
                                        <dd className="text-sm text-gray-900 sm:text-right">
                                            {editMode === prop ? (
                                                <div className="flex items-center justify-end space-x-2">
                                                    {prop === 'password' ? (
                                                        <>
                                                            <input
                                                                type="password"
                                                                value={currentPassword}
                                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                                placeholder="Current Password"
                                                                className="px-2 py-1 border rounded"
                                                            />
                                                            <input
                                                                type="password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                placeholder="New Password"
                                                                className="px-2 py-1 border rounded"
                                                            />
                                                        </>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="px-2 py-1 border rounded"
                                                        />
                                                    )}
                                                    <button onClick={handleSave} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150 transform hover:scale-105">Save</button>
                                                    <button onClick={handleCancel} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150 transform hover:scale-105">Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <span>{prop === 'password' ? '********' : userInfo[prop] || 'N/A'}</span>
                                                    {['institute', 'expertise', 'email', 'password'].includes(prop) && (
                                                        <button
                                                            onClick={() => handleEdit(prop)}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 transform hover:scale-105"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}