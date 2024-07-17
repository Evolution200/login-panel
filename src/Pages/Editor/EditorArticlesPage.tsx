import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EditorLayout } from './EditorLayout';
import { useUserStore } from '../../Store/UserStore';
import { SendPostRequest } from '../../Common/SendPost';
import { ReadPeriodicalTaskListMessage } from 'Plugins/TaskAPI/ReadPeriodicalTaskListMessage';
import { EditorReadInfoMessage } from 'Plugins/EditorAPI/EditorReadInfoMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';

interface Article {
    taskName: string;
    periodical: string;
    author: string;
    state: string;
}

export function EditorArticlesPage() {
    const { username } = useUserStore();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [periodicalName, setPeriodicalName] = useState<string>('');

    useEffect(() => {
        fetchEditorPeriodicalAndArticles();
    }, [username]);

    const fetchEditorPeriodicalAndArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const periodicalResponse = await SendPostRequest(new EditorReadInfoMessage(username, 'periodical'));
            if (!periodicalResponse || !periodicalResponse.data) {
                throw new Error('Failed to fetch editor periodical');
            }
            const fetchedPeriodicalName = periodicalResponse.data;
            setPeriodicalName(fetchedPeriodicalName);

            const articlesResponse = await SendPostRequest(new ReadPeriodicalTaskListMessage(fetchedPeriodicalName));
            if (!articlesResponse || !articlesResponse.data) {
                throw new Error('Failed to fetch articles');
            }
            const taskList = JSON.parse(articlesResponse.data);

            const articlesData = await Promise.all(taskList.map(async (task: { taskName: string }) => {
                const [stateResponse, authorResponse] = await Promise.all([
                    SendPostRequest(new ReadTaskInfoMessage(task.taskName, 'state')),
                    SendPostRequest(new ReadTaskInfoMessage(task.taskName, 'author'))
                ]);

                const [surNameResponse, lastNameResponse] = await Promise.all([
                    SendPostRequest(new UserReadInfoMessage(authorResponse.data, 'sur_name')),
                    SendPostRequest(new UserReadInfoMessage(authorResponse.data, 'last_name'))
                ]);

                const authorName = `${surNameResponse.data} ${lastNameResponse.data}`;

                return {
                    taskName: task.taskName,
                    periodical: fetchedPeriodicalName,
                    author: authorName,
                    state: stateResponse.data || 'Unknown'
                };
            }));

            setArticles(articlesData);
        } catch (error) {
            console.error('Error fetching periodical and articles:', error);
            setError('Failed to load periodical and articles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EditorLayout currentPage="articles">
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">Articles in {periodicalName}</h2>
                        <p className="mt-1 text-xl text-white opacity-80">
                            View all articles submitted to your journal
                        </p>
                    </div>
                </div>

                {loading && <p className="text-center text-gray-600">Loading articles...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}

                {!loading && !error && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodical</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.taskName} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link to={`/article-log/${encodeURIComponent(article.taskName)}`} className="text-indigo-600 hover:text-indigo-900">
                                            {article.taskName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.periodical}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {article.state}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </EditorLayout>
    );
}