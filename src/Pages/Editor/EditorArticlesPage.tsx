import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorLayout } from './EditorLayout';
import { useUserStore } from '../../Store/UserStore';
import { useEditorTaskStore } from '../../Store/EditorTaskStore';

enum TaskState {
    Init = 'init',
    InProgress = 'inProgress',
    Completed = 'completed',
    Rejected = 'rejected'
}

const stateColorMap: Record<TaskState, string> = {
    [TaskState.Init]: 'bg-blue-100 text-blue-800',
    [TaskState.InProgress]: 'bg-yellow-100 text-yellow-800',
    [TaskState.Completed]: 'bg-green-100 text-green-800',
    [TaskState.Rejected]: 'bg-red-100 text-red-800'
};

export function EditorArticlesPage() {
    const { username } = useUserStore();
    const { tasks, editorPeriodical, loading, error, fetchEditorPeriodical, fetchTasks, addReviewer } = useEditorTaskStore();
    const [newReviewerUsername, setNewReviewerUsername] = useState('');
    const [addReviewerMessage, setAddReviewerMessage] = useState('');
    const [addReviewerStatus, setAddReviewerStatus] = useState<'success' | 'error' | null>(null);


    useEffect(() => {
        if (username) {
            fetchEditorPeriodical(username).then(() => fetchTasks());
        }
    }, [username, fetchEditorPeriodical, fetchTasks]);

    const getDisplayState = (state: string): string => {
        return state === TaskState.Init ? 'Initial Review' : state;
    };

    const getStateColorClass = (state: string): string => {
        return stateColorMap[state as TaskState] || 'bg-gray-100 text-gray-800';
    };

    const handleAddReviewer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newReviewerUsername) {
            try {
                const result = await addReviewer(newReviewerUsername);
                if (result === "Successfully authorized") {
                    setAddReviewerMessage("Reviewer added successfully.");
                    setAddReviewerStatus('success');
                    setNewReviewerUsername('');
                } else if (result.includes("doesn't exist")) {
                    setAddReviewerMessage("User doesn't exist.");
                    setAddReviewerStatus('error');
                } else if (result === "already authorized"){
                    setAddReviewerMessage("User already authorized.");
                    setAddReviewerStatus('error');
                } else {
                    setAddReviewerMessage("An error occurred while adding the reviewer.");
                    setAddReviewerStatus('error');
                }
            } catch (error) {
                setAddReviewerMessage("An error occurred while adding the reviewer.");
                setAddReviewerStatus('error');
            }

            // Clear the message after 5 seconds
            setTimeout(() => {
                setAddReviewerMessage('');
                setAddReviewerStatus(null);
            }, 5000);
        }
    };

    return (
        <EditorLayout currentPage="articles">
            <div className="space-y-8">
                <div
                    className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">Articles in {editorPeriodical}</h2>
                        <p className="mt-1 text-xl text-white opacity-80">
                            Manage and review submitted articles
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add Reviewer</h3>
                        <form onSubmit={handleAddReviewer} className="mt-5 sm:flex sm:items-center">
                            <div className="w-full sm:max-w-xs">
                                <label htmlFor="reviewer" className="sr-only">Reviewer Username</label>
                                <input
                                    type="text"
                                    name="reviewer"
                                    id="reviewer"
                                    className="mt-1 block w-[300px] pl-3 pr-16 py-2 text-base text-gray-600 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    placeholder="Enter reviewer username"
                                    value={newReviewerUsername}
                                    onChange={(e) => setNewReviewerUsername(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Add Reviewer
                            </button>
                        </form>
                        {addReviewerMessage && (
                            <div
                                className={`mt-3 text-sm ${addReviewerStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {addReviewerMessage}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        {loading && <p className="text-gray-600">Loading...</p>}
                        {error && <p className="text-red-600">{error}</p>}
                        {!loading && !error && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article
                                            Name
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authors
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodical
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {tasks.map((task) => (
                                        <tr key={task.taskName} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link to={`/article-log/${encodeURIComponent(task.taskName)}`}
                                                      className="text-indigo-600 hover:text-indigo-900">
                                                    {task.taskName}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.authors.join(', ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.periodicalName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColorClass(task.state)}`}>
                                                    {getDisplayState(task.state)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </EditorLayout>
    );
}