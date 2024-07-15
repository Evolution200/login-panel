import React, { useEffect } from 'react';
import { useUserStore } from '../../Store/UserStore';
import { useUserTaskStore } from '../../Store/UserTaskStore';
import { UserLayout } from './UserLayout';

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

    useEffect(() => {
        if (username) {
            fetchTasks(username);
        }
    }, [username, fetchTasks]);

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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.taskName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.periodicalName || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColorClass(task.state)}`}>
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