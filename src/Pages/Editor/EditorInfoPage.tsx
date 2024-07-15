import React, { useState, useEffect } from 'react';
import { EditorReadInfoMessage } from 'Plugins/EditorAPI/EditorReadInfoMessage';
import { UserReadProfilePhotoMessage } from 'Plugins/EditorAPI/UserReadProfilePhotoMessage';
import { UserEditProfilePhotoMessage } from 'Plugins/EditorAPI/UserEditProfilePhotoMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore } from '../../Store/UserStore';
import { EditorLayout } from './EditorLayout';

interface EditorInfoData {
    user_name: string;
    sur_name: string;
    last_name: string;
    institute: string;
    expertise: string;
    email: string;
    periodical: string;
}

const editorProperties: (keyof EditorInfoData)[] = ['user_name', 'sur_name', 'last_name', 'institute', 'expertise', 'email', 'periodical'];

const propertyDisplayNames: Record<keyof EditorInfoData, string> = {
    user_name: 'Username',
    sur_name: 'First Name',
    last_name: 'Last Name',
    institute: 'Institute',
    expertise: 'Expertise',
    email: 'Email',
    periodical: 'Periodical'
};

export function EditorInfoPage() {
    const { username } = useUserStore();
    const [editorInfo, setEditorInfo] = useState<Partial<EditorInfoData>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadEditorInfo();
        loadProfilePhoto();
    }, []);

    const loadEditorInfo = async () => {
        try {
            const infoPromises = editorProperties.map(property =>
                SendPostRequest(new EditorReadInfoMessage(username, property))
            );
            const results = await Promise.all(infoPromises);

            const newEditorInfo: Partial<EditorInfoData> = {};
            results.forEach((result, index) => {
                if (result && result.data) {
                    newEditorInfo[editorProperties[index]] = result.data;
                }
            });

            setEditorInfo(newEditorInfo);
            setErrorMessage('');
        } catch (error) {
            console.error('Failed to load editor info:', error);
            setErrorMessage('Failed to load editor information. Please try again later.');
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

    return (
        <EditorLayout currentPage="info">
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">
                            Editor Profile
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm text-indigo-100">
                            Your personal and professional information
                        </p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{errorMessage}</p>
                                </div>
                            </div>
                        </div>
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

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Personal Information
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Details and application.
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    {editorProperties.map((prop, index) => (
                                        <div key={prop} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                            <dt className="text-sm font-medium text-gray-500">
                                                {propertyDisplayNames[prop]}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {editorInfo[prop] || 'N/A'}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
}