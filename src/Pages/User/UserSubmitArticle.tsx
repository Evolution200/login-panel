import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';
import { UserSubmissionMessage } from 'Plugins/UserAPI/UserSubmissionMessage';
import { ReadPeriodicalsMessage } from 'Plugins/ManagerAPI/ReadPeriodicalsMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { UserLayout } from './UserLayout';

export function UserSubmitArticle() {
    const history = useHistory();
    const { username } = useUserStore();
    const [taskName, setTaskName] = useState('');
    const [periodicalName, setPeriodicalName] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [periodicals, setPeriodicals] = useState<string[]>([]);

    useEffect(() => {
        fetchPeriodicals();
    }, []);

    const fetchPeriodicals = async () => {
        try {
            const message = new ReadPeriodicalsMessage();
            const response = await SendPostRequest(message);
            if (response && response.data) {
                const periodicalsData = JSON.parse(response.data);
                if (Array.isArray(periodicalsData)) {
                    const periodicalsList = periodicalsData.map(item => item.periodical);
                    setPeriodicals(periodicalsList);
                    if (periodicalsList.length > 0) {
                        setPeriodicalName(periodicalsList[0]);
                    }
                } else {
                    throw new Error('Unexpected data format');
                }
            }
        } catch (error) {
            console.error('Failed to fetch periodicals:', error);
            setErrorMessage('Failed to load periodicals. Please try again.');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImageBase64(base64String.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!imageBase64) {
            setErrorMessage('Please select an image to upload.');
            return;
        }

        const message = new UserSubmissionMessage(username, taskName, periodicalName, imageBase64);

        try {
            const response = await SendPostRequest(message);
            if (response && response.status === 200) {
                if (response.data === "OK") {
                    alert("Submission successful!");
                    setTaskName('');
                    setPeriodicalName(periodicals[0] || '');
                    setImageBase64('');
                } else if (response.data === "Task Name Conflict") {
                    setErrorMessage("A task with this name already exists. Please choose a different task name.");
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
            } else {
                setErrorMessage("Failed to submit. Please try again later.");
            }
        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <UserLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Submit Article</h2>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="taskName" className="sr-only">Task Name</label>
                            <input
                                id="taskName"
                                name="taskName"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Task Name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="periodicalName" className="sr-only">Periodical Name</label>
                            <select
                                id="periodicalName"
                                name="periodicalName"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={periodicalName}
                                onChange={(e) => setPeriodicalName(e.target.value)}
                            >
                                {periodicals.map((periodical, index) => (
                                    <option key={index} value={periodical}>{periodical}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="image" className="sr-only">Upload Image</label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit Article
                        </button>
                    </div>
                </form>
                <button
                    onClick={() => history.goBack()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back
                </button>
            </div>
        </UserLayout>
    );
}