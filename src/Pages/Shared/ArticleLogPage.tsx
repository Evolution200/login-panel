import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserLayout } from './UserLayout';
import { SendPostRequest } from '../../Common/SendPost';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';
import { useUserStore } from '../../Store/UserStore';
import { CommentSystem } from './CommentSystem';

interface ArticleInfo {
    title: string;
    author: string;
    taskPeriodical: string;
    taskArea: string;
    tldr: string;
    abstract: string;
    keywords: string;
}

export function ArticleLogPage() {
    const { taskName } = useParams<{ taskName: string }>();
    const { username } = useUserStore();
    const [articleInfo, setArticleInfo] = useState<ArticleInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticleInfo() {
            try {
                setLoading(true);
                setError(null);

                // Fetch task info
                const taskPeriodicalResponse = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'task_periodical'));
                const taskAreaResponse = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'task_area'));
                const tldrResponse = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'tldr'));
                const abstractResponse = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'abstract'));
                const keywordsResponse = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'keyword'));

                if (!taskPeriodicalResponse.data || !taskAreaResponse.data || !tldrResponse.data || !abstractResponse.data || !keywordsResponse.data) {
                    throw new Error("Failed to fetch task info");
                }

                // Fetch user info (author name)
                const surNameResponse = await SendPostRequest(new UserReadInfoMessage(username, 'sur_name'));
                const lastNameResponse = await SendPostRequest(new UserReadInfoMessage(username, 'last_name'));
                if (!surNameResponse.data || !lastNameResponse.data) {
                    throw new Error("Failed to fetch user info");
                }

                const authorName = `${surNameResponse.data} ${lastNameResponse.data}`;

                setArticleInfo({
                    title: taskName,
                    author: authorName,
                    taskPeriodical: taskPeriodicalResponse.data,
                    taskArea: taskAreaResponse.data,
                    tldr: tldrResponse.data,
                    abstract: abstractResponse.data,
                    keywords: keywordsResponse.data
                });
            } catch (err) {
                setError("An error occurred while fetching article information.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchArticleInfo();
    }, [taskName, username]);

    if (loading) {
        return <UserLayout><div className="text-center mt-8">Loading...</div></UserLayout>;
    }

    if (error) {
        return <UserLayout><div className="text-center mt-8 text-red-600">{error}</div></UserLayout>;
    }

    if (!articleInfo) {
        return <UserLayout><div className="text-center mt-8">No article information found.</div></UserLayout>;
    }

    return (
        <UserLayout>
            <div className="max-w-4xl mx-auto space-y-8 p-6">
                <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-3xl font-extrabold text-white">Article Details</h2>
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-8 space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">{articleInfo.title}</h1>
                        <p className="text-xl text-gray-700">Author: {articleInfo.author}</p>
                        <p className="text-lg text-gray-600">Journal: {articleInfo.taskPeriodical}</p>
                        <p className="text-lg text-gray-600">Research Area: {articleInfo.taskArea}</p>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Keywords</h3>
                            <p className="text-gray-700">{articleInfo.keywords}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">TL;DR</h3>
                            <p className="text-gray-700">{articleInfo.tldr}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Abstract</h3>
                            <p className="text-gray-700">{articleInfo.abstract}</p>
                        </div>
                    </div>
                </div>

                {/* 评论系统 */}
                <CommentSystem taskName={taskName} />
            </div>
        </UserLayout>
    );
}