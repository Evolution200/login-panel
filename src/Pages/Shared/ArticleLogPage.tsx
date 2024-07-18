import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { SendPostRequest } from '../../Common/SendPost';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { ReadTaskAuthorMessage } from 'Plugins/TaskAPI/ReadTaskAuthorMessage';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';
import { CheckTaskIdentityMessage } from 'Plugins/TaskAPI/CheckTaskIdentityMessage';
import { useUserStore } from '../../Store/UserStore';
import { RoleBasedView } from './RoleBasedView';
import { ReadTaskPDFMessage } from 'Plugins/TaskAPI/ReadTaskPDFMessage';
import { EditorReadInfoMessage } from 'Plugins/EditorAPI/EditorReadInfoMessage';

interface ArticleInfo {
    title: string;
    authors: string[];
    taskPeriodical: string;
    taskArea: string;
    tldr: string;
    abstract: string;
    keywords: string;
    pdfBase64: string;
}

export function ArticleLogPage() {
    const { taskName } = useParams<{ taskName: string }>();
    const { username, role, clearUser } = useUserStore();
    const history = useHistory();
    const [articleInfo, setArticleInfo] = useState<ArticleInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('');
    const [editorPeriodical, setEditorPeriodical] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const [articleInfoResult, userRoleResult] = await Promise.all([
                    fetchArticleInfo(),
                    checkUserRole()
                ]);

                setArticleInfo(articleInfoResult);
                setUserRole(userRoleResult);

                if (userRoleResult === 'editor') {
                    const editorResponse = await SendPostRequest(new EditorReadInfoMessage(username, 'periodical'));
                    if (editorResponse && editorResponse.data) {
                        setEditorPeriodical(editorResponse.data);
                    }
                }
            } catch (err) {
                setError("An error occurred while fetching information.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [taskName, username]);

    async function fetchArticleInfo(): Promise<ArticleInfo> {
        const [
            taskPeriodicalResponse,
            taskAreaResponse,
            tldrResponse,
            abstractResponse,
            keywordsResponse,
            authorsResponse,
            pdfResponse
        ] = await Promise.all([
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'task_periodical')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'task_area')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'tldr')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'abstract')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'keyword')),
            SendPostRequest(new ReadTaskAuthorMessage(taskName)),
            SendPostRequest(new ReadTaskPDFMessage(taskName))
        ]);

        if (!taskPeriodicalResponse.data || !taskAreaResponse.data || !tldrResponse.data ||
            !abstractResponse.data || !keywordsResponse.data || !authorsResponse.data || !pdfResponse.data) {
            throw new Error("Failed to fetch task info");
        }

        const authorsData = JSON.parse(authorsResponse.data) as { userName: string }[];
        const authorUsernames = authorsData.map(author => author.userName);

        const authorNamesPromises = authorUsernames.map(async (userName) => {
            const surNameResponse = await SendPostRequest(new UserReadInfoMessage(userName, 'sur_name'));
            const lastNameResponse = await SendPostRequest(new UserReadInfoMessage(userName, 'last_name'));
            return `${surNameResponse.data} ${lastNameResponse.data}`;
        });

        const authorNames = await Promise.all(authorNamesPromises);

        return {
            title: taskName,
            authors: authorNames,
            taskPeriodical: taskPeriodicalResponse.data,
            taskArea: taskAreaResponse.data,
            tldr: tldrResponse.data,
            abstract: abstractResponse.data,
            keywords: keywordsResponse.data,
            pdfBase64: pdfResponse.data
        };
    }

    async function checkUserRole(): Promise<string> {
        if (role =='user'){
            const response = await SendPostRequest(new CheckTaskIdentityMessage(taskName, username, ''));
            return response.data;
        }
        if (role =='editor'){
            return 'editor'
        }
    }

    const handleDownloadPDF = () => {
        if (articleInfo && articleInfo.pdfBase64) {
            const linkSource = `data:application/pdf;base64,${articleInfo.pdfBase64}`;
            const downloadLink = document.createElement("a");
            const fileName = `${articleInfo.title}.pdf`;

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    };

    const handleGoBack = () => {
        history.goBack();
    };

    const handleLogout = () => {
        clearUser();
        history.push('/');
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    if (!articleInfo) {
        return <div className="text-center mt-8">No article information found.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <svg className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h1 className="text-3xl font-bold">Socratic</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-indigo-100">Welcome, {username}!</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto mt-8 p-6 bg-white bg-opacity-80 rounded-lg shadow-lg border border-indigo-100">
                <button
                    onClick={handleGoBack}
                    className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
                >
                    ← Go Back
                </button>

                <div className="space-y-8">
                    {/* 文章信息显示 */}
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        <div className="p-8 space-y-6">
                            <h1 className="text-3xl font-bold text-gray-900">{articleInfo.title}</h1>
                            <p className="text-xl text-gray-700">Authors: {articleInfo.authors.join(', ')}</p>
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
                            <button
                                onClick={handleDownloadPDF}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* 基于角色的视图 */}
                    <RoleBasedView
                        userRole={userRole}
                        taskName={taskName}
                        editorPeriodical={editorPeriodical}
                        articlePeriodical={articleInfo.taskPeriodical}
                    />
                </div>
            </main>
        </div>
    );
}