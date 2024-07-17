import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../Store/UserStore';
import { useUserTaskStore } from '../../Store/UserTaskStore';
import { UserLayout } from './UserLayout';
import { AddTaskIdentityMessage } from 'Plugins/TaskAPI/AddTaskIdentityMessage';
import { SendPostRequest } from '../../Common/SendPost'

// 定义可能的状态类型
type TaskState = 'init' | 'inProgress' | 'completed' | 'rejected';

// 使用 Record 类型来定义 stateColorMap
const stateColorMap: Record<TaskState | 'default', string> = {
    init: 'bg-blue-100 text-blue-800',
    inProgress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
};

export function UserPersonalArticlePage() {
    const { username } = useUserStore();
    const { tasks, loading, error, fetchTasks } = useUserTaskStore();
    const [newAuthor, setNewAuthor] = useState('');
    const [selectedTask, setSelectedTask] = useState('');
    const [addAuthorError, setAddAuthorError] = useState('');
    const [addAuthorSuccess, setAddAuthorSuccess] = useState('');

    useEffect(() => {
        if (username) {
            fetchTasks(username);
        }
    }, [username, fetchTasks]);

    const handleAddAuthor = async () => {
        if (!selectedTask || !newAuthor) {
            setAddAuthorError('Please select a task and enter a username.');
            return;
        }

        try {
            const message = new AddTaskIdentityMessage(selectedTask, newAuthor, 'author');
            const response = await SendPostRequest(message);

            if (response.data === 'OK') {
                setAddAuthorSuccess(`Author ${newAuthor} added successfully to ${selectedTask}`);
                setAddAuthorError('');
                setNewAuthor('');
                setSelectedTask('');
            } else if (response.data === `User ${newAuthor} already registered`) {
                setAddAuthorError(`${newAuthor} is already an author of this article.`);
                setAddAuthorSuccess('');
            } else {
                setAddAuthorError(response.data);
                setAddAuthorSuccess('');
            }
        } catch (error) {
            setAddAuthorError('An error occurred while adding the author.');
            setAddAuthorSuccess('');
        }
    };

    const getDisplayState = (state: string): string => {
        return state === 'init' ? 'Initial Review' : state;
    };

    const getStateColorClass = (state: string): string => {
        return stateColorMap[state as TaskState] || stateColorMap.default;
    };

    return (
        <UserLayout>
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">Personal Articles</h2>
                        <p className="mt-1 text-xl text-white opacity-80">
                            View and manage your submitted articles
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        {/* Add Author Form */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Author to Article</h3>
                            <div className="flex space-x-4">
                                <select
                                    value={selectedTask}
                                    onChange={(e) => setSelectedTask(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select an article</option>
                                    {tasks.map((task) => (
                                        <option key={task.taskName} value={task.taskName}>
                                            {task.taskName}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="Enter username"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button
                                    onClick={handleAddAuthor}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Author
                                </button>
                            </div>
                            {addAuthorError && (
                                <p className="mt-2 text-sm text-red-600">{addAuthorError}</p>
                            )}
                            {addAuthorSuccess && (
                                <p className="mt-2 text-sm text-green-600">{addAuthorSuccess}</p>
                            )}
                        </div>

                        {loading && <p className="text-gray-600">Loading...</p>}
                        {error && <p className="text-red-600">{error}</p>}
                        {!loading && !error && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodical</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {tasks.map((task, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link to={`/article-log/${encodeURIComponent(task.taskName)}`}
                                                      className="text-indigo-600 hover:text-indigo-900">
                                                    {task.taskName}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.periodicalName || 'N/A'}</td>
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
        </UserLayout>
    );
}