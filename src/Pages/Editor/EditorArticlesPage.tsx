import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EditorLayout } from './EditorLayout';
import { useUserStore } from '../../Store/UserStore';
import { useEditorTaskStore } from '../../Store/EditorTaskStore';

// 使用枚举定义可能的状态类型
enum TaskState {
    Init = 'init',
    InProgress = 'inProgress',
    Completed = 'completed',
    Rejected = 'rejected'
}

// 使用 Record 类型来定义 stateColorMap，现在使用 TaskState 枚举
const stateColorMap: Record<TaskState, string> = {
    [TaskState.Init]: 'bg-blue-100 text-blue-800',
    [TaskState.InProgress]: 'bg-yellow-100 text-yellow-800',
    [TaskState.Completed]: 'bg-green-100 text-green-800',
    [TaskState.Rejected]: 'bg-red-100 text-red-800'
};

export function EditorArticlesPage() {
    const { username } = useUserStore();
    const { tasks, editorPeriodical, loading, error, fetchEditorPeriodical, fetchTasks } = useEditorTaskStore();

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

    return (
        <EditorLayout currentPage="articles">
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">Articles in {editorPeriodical}</h2>
                        <p className="mt-1 text-xl text-white opacity-80">
                            Manage and review submitted articles
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authors</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodical</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {tasks.map((task) => (
                                        <tr key={task.taskName} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link to={`/article-log/${encodeURIComponent(task.taskName)}`} className="text-indigo-600 hover:text-indigo-900">
                                                    {task.taskName}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.authors.join(', ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{task.periodicalName}</td>
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
        </EditorLayout>
    );
}