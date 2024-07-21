import React, { useState, useEffect } from 'react';
import { EditorReadInfoMessage } from 'Plugins/EditorAPI/EditorReadInfoMessage';
import { UserReadProfilePhotoMessage } from 'Plugins/EditorAPI/UserReadProfilePhotoMessage';
import { UserEditProfilePhotoMessage } from 'Plugins/EditorAPI/UserEditProfilePhotoMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { useUserStore } from '../../Store/UserStore';
import { EditorLayout } from './EditorLayout';

class EditorInfoData {
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
            <div className="max-w-4xl mx-auto space-y-8 p-6">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">Editor Profile</h2>
                        <p className="mt-1 text-xl text-white opacity-80">Manage your personal and professional information</p>
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
                                <h3 className="text-2xl font-semibold text-gray-800">{editorInfo.sur_name} {editorInfo.last_name}</h3>
                                <p className="text-gray-600">{editorInfo.email}</p>
                                <label htmlFor="photo-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out inline-block text-center transform hover:scale-105">
                                    Update Profile Picture
                                </label>
                                <input id="photo-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-8">
                            <h4 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h4>
                            <dl className="space-y-8">
                                {editorProperties.map((prop) => (
                                    <div key={prop} className="flex flex-col sm:flex-row sm:justify-between">
                                        <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">{propertyDisplayNames[prop]}</dt>
                                        <dd className="text-sm text-gray-900 sm:text-right">
                                            <span>{editorInfo[prop] || 'N/A'}</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
}