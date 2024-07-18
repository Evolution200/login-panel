import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useArticleSearchStore } from '../../Store/ArticleSearchStore';
import { SharedLayout } from './SharedLayout';

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

export function ArticleSearchPage() {
    const { periodicals, articles, loading, error, fetchPeriodicals, fetchArticlesByPeriodical, searchArticlesByName, resetSearch } = useArticleSearchStore();
    const [selectedPeriodical, setSelectedPeriodical] = useState('');
    const [articleName, setArticleName] = useState('');
    const history = useHistory();

    useEffect(() => {
        fetchPeriodicals();
        return () => {
            resetSearch(); // Reset search when component unmounts
        };
    }, [fetchPeriodicals, resetSearch]);

    const handlePeriodicalSearch = () => {
        if (selectedPeriodical) {
            fetchArticlesByPeriodical(selectedPeriodical);
        }
    };

    const handleArticleNameSearch = () => {
        if (articleName) {
            searchArticlesByName(articleName);
        }
    };

    const handleBack = () => {
        resetSearch();
        setSelectedPeriodical('');
        setArticleName('');
        history.goBack();
    };

    const getDisplayState = (state: string): string => {
        return state === TaskState.Init ? 'Initial Review' : state;
    };

    const getStateColorClass = (state: string): string => {
        return stateColorMap[state as TaskState] || 'bg-gray-100 text-gray-800';
    };

    return (
        <SharedLayout showSidebar={false}>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Article Search</h2>
                    <button
                        onClick={handleBack}
                        className="inline-flex justify-center items-center w-[120px] px-4 py-2 border border-transparent text-center font-bold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105"
                    >
                        Back
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Search by Article Name</h3>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={articleName}
                                    onChange={(e) => setArticleName(e.target.value)}
                                    placeholder="Enter article name"
                                    className="mt-1 block w-[800px] pl-3 pr-16 py-2 text-base text-gray-600 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                                <button
                                    onClick={handleArticleNameSearch}
                                    className="inline-flex justify-center items-center w-[160px] px-4 py-2 border border-transparent text-center font-bold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Search by Periodical</h3>
                            <div className="flex space-x-4">
                                <select
                                    value={selectedPeriodical}
                                    onChange={(e) => setSelectedPeriodical(e.target.value)}
                                    className="mt-1 block w-[800px] pl-3 pr-10 py-2 text-base text-gray-600 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select a periodical</option>
                                    {periodicals.map((periodical) => (
                                        <option key={periodical} value={periodical}>
                                            {periodical}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handlePeriodicalSearch}
                                    className="inline-flex justify-center items-center w-[160px] px-4 py-2 border border-transparent text-center font-bold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {loading && <p className="text-gray-600">Loading...</p>}
                        {error && <p className="text-red-600">{error}</p>}
                        {!loading && !error && articles.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodical</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {articles.map((article) => (
                                        <tr key={article.taskName} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <Link to={`/article-log/${encodeURIComponent(article.taskName)}`} className="text-indigo-600 hover:text-indigo-900">
                                                    {article.taskName}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{article.periodicalName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateColorClass(article.state)}`}>
                                                    {getDisplayState(article.state)}
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
        </SharedLayout>
    );
}