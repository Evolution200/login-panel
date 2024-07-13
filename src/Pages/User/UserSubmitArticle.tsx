import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';
import { UserSubmissionMessage } from 'Plugins/UserAPI/UserSubmissionMessage';
import { SendPostRequest } from '../../Common/SendPost';
import { UserLayout } from './UserLayout';
import { FetchPeriodicals } from '../../Common/FetchPeriodicals';

export function UserSubmitArticle() {
    const history = useHistory();
    const { username } = useUserStore();
    const [taskName, setTaskName] = useState('');
    const [periodicalName, setPeriodicalName] = useState('');
    const [pdfBase64, setPdfBase64] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [periodicals, setPeriodicals] = useState<string[]>([]);

    useEffect(() => {
        loadPeriodicals();
    }, []);

    const loadPeriodicals = async () => {
        try {
            const periodicalsList = await FetchPeriodicals();
            setPeriodicals(periodicalsList);
            if (periodicalsList.length > 0) {
                setPeriodicalName(periodicalsList[0]);
            }
        } catch (error) {
            setErrorMessage('Failed to load periodicals. Please try again.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPdfBase64(base64String.split(',')[1]); // Get base64 string without data prefix
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!pdfBase64) {
            setErrorMessage('Please select a PDF file to upload.');
            return;
        }

        const message = new UserSubmissionMessage(username, taskName, periodicalName, pdfBase64);

        try {
            const response = await SendPostRequest(message);
            if (response && response.status === 200) {
                if (response.data === "OK") {
                    alert("Submission successful!");
                    setTaskName('');
                    setPeriodicalName(periodicals[0] || '');
                    setPdfBase64('');
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
                    <div>
                        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
                            Task Name
                        </label>
                        <input
                            id="taskName"
                            name="taskName"
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="periodicalName" className="block text-sm font-medium text-gray-700">
                            Periodical Name
                        </label>
                        <select
                            id="periodicalName"
                            name="periodicalName"
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={periodicalName}
                            onChange={(e) => setPeriodicalName(e.target.value)}
                        >
                            {periodicals.map((periodical, index) => (
                                <option key={index} value={periodical}>{periodical}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">
                            Upload PDF
                        </label>
                        <input
                            id="pdf"
                            name="pdf"
                            type="file"
                            accept="application/pdf"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={handleFileChange}
                        />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit Article
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}