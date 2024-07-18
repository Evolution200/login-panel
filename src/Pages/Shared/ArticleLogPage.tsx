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
    state: string;
}

enum TaskState {
    Init = 'init',
    InProgress = 'inProgress',
    Completed = 'completed',
    Rejected = 'rejected'
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
    const [articleState, setArticleState] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                const [articleInfoResult, userRoleResult,] = await Promise.all([
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
            pdfResponse,
            stateResponse,
        ] = await Promise.all([
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'task_periodical')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'task_area')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'tldr')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'abstract')),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'keyword')),
            SendPostRequest(new ReadTaskAuthorMessage(taskName)),
            SendPostRequest(new ReadTaskPDFMessage(taskName)),
            SendPostRequest(new ReadTaskInfoMessage(taskName, 'state')),
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
            pdfBase64: pdfResponse.data,
            state: stateResponse.data
        };
    }

    async function checkUserRole(): Promise<string> {
        if (role =='user'){
            const response = await SendPostRequest(new CheckTaskIdentityMessage(taskName, username));
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
                                className="px-12 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="space-y-8 max-w-4xl mx-auto mt-8 p-6 bg-white bg-opacity-80 rounded-lg shadow-lg border border-indigo-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Article Review</h2>
                        <p className="mt-1 text-xl text-gray-500">The unexamined paper is not worth publishing.</p>
                    </div>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex justify-center items-center w-[120px] px-4 py-2 border border-transparent text-center font-bold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105"
                    >
                        Back
                    </button>
                </div>

                <div className="space-y-12">
                    {/* 文章信息显示 */}
                    <div
                        className="bg-white shadow-xl rounded-lg overflow-hidden border border-indigo-200 max-w-4xl mx-auto">
                        <div className="p-8 space-y-2">
                            <div className="flex items-start">
                                <div>
                                    <div className="flex items-center">
                                        <h2 className="text-4xl font-extrabold text-indigo-700">{articleInfo.title}</h2>
                                        <svg
                                            width="36"
                                            height="36"
                                            viewBox="0 0 512 512"
                                            xmlns="http://www.w3.org/2000/svg"
                                            onClick={handleDownloadPDF}
                                            className="ml-2 cursor-pointer hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
                                        >
                                            <g fill="currentColor">
                                                <path
                                                    d="M347.746,346.204c-8.398-0.505-28.589,0.691-48.81,4.533c-11.697-11.839-21.826-26.753-29.34-39.053 c24.078-69.232,8.829-88.91-11.697-88.91c-16.119,0-24.167,17.011-22.376,35.805c0.906,9.461,8.918,29.34,18.78,48.223 c-6.05,15.912-16.847,42.806-27.564,62.269c-12.545,3.812-23.305,8.048-31.027,11.622c-38.465,17.888-41.556,41.773-33.552,51.894 c15.197,19.226,47.576,2.638,80.066-55.468c22.243-6.325,51.508-14.752,54.146-14.752c0.304,0,0.721,0.097,1.204,0.253 c16.215,14.298,35.366,30.67,51.128,32.825c22.808,3.136,35.791-13.406,34.891-23.692 C382.703,361.461,376.691,347.942,347.746,346.204z M203.761,408.88c-9.401,11.178-24.606,21.9-29.972,18.334 c-5.373-3.574-6.265-13.86,5.819-25.497c12.076-11.623,32.29-17.657,35.329-18.787c3.59-1.337,4.482,0,4.482,1.791 C219.419,386.512,213.154,397.689,203.761,408.88z M244.923,258.571c-0.899-11.192,1.33-21.922,10.731-23.26 c9.386-1.352,13.868,9.386,10.292,26.828c-3.582,17.464-5.38,29.08-7.164,30.44c-1.79,1.338-3.567-3.144-3.567-3.144 C251.627,282.27,245.815,269.748,244.923,258.571z M248.505,363.697c4.912-8.064,17.442-40.702,17.442-40.702 c2.683,4.926,23.699,29.956,23.699,29.956S257.438,360.123,248.505,363.697z M345.999,377.995 c-13.414-1.768-36.221-17.895-36.221-17.895c-3.128-1.337,24.992-5.157,35.79-4.466c13.875,0.9,18.794,6.718,18.794,12.53 C364.362,373.982,359.443,379.787,345.999,377.995z" />
                                                <path
                                                    d="M461.336,107.66l-98.34-98.348L353.683,0H340.5H139.946C92.593,0,54.069,38.532,54.069,85.901v6.57H41.353 v102.733h12.716v230.904c0,47.361,38.525,85.893,85.878,85.893h244.808c47.368,0,85.893-38.532,85.893-85.893V130.155v-13.176 L461.336,107.66z M384.754,480.193H139.946c-29.875,0-54.086-24.212-54.086-54.086V195.203h157.31V92.47H85.86v-6.57 c0-29.882,24.211-54.102,54.086-54.102H332.89v60.894c0,24.888,20.191,45.065,45.079,45.065h60.886v288.349 C438.855,455.982,414.636,480.193,384.754,480.193z M88.09,166.086v-47.554c0-0.839,0.683-1.524,1.524-1.524h15.108 c2.49,0,4.786,0.409,6.837,1.212c2.029,0.795,3.812,1.91,5.299,3.322c1.501,1.419,2.653,3.144,3.433,5.121 c0.78,1.939,1.182,4.058,1.182,6.294c0,2.282-0.402,4.414-1.19,6.332c-0.78,1.918-1.932,3.619-3.418,5.054 c-1.479,1.427-3.27,2.549-5.321,3.329c-2.036,0.78-4.332,1.174-6.822,1.174h-6.376v17.241c0,0.84-0.683,1.523-1.523,1.523h-7.208 C88.773,167.61,88.09,166.926,88.09,166.086z M134.685,166.086v-47.554c0-0.839,0.684-1.524,1.524-1.524h16.698 c3.173,0,5.968,0.528,8.324,1.568c2.386,1.062,4.518,2.75,6.347,5.009c0.944,1.189,1.694,2.504,2.236,3.916 c0.528,1.375,0.929,2.862,1.189,4.407c0.253,1.531,0.401,3.181,0.453,4.957c0.045,1.694,0.067,3.515,0.067,5.447 c0,1.924-0.022,3.746-0.067,5.44c-0.052,1.769-0.2,3.426-0.453,4.964c-0.26,1.546-0.661,3.025-1.189,4.399 c-0.55,1.427-1.3,2.743-2.23,3.909c-1.842,2.282-3.976,3.969-6.354,5.016c-2.334,1.04-5.135,1.568-8.324,1.568h-16.698 C135.368,167.61,134.685,166.926,134.685,166.086z M214.269,137.981c0.84,0,1.523,0.684,1.523,1.524v6.48 c0,0.84-0.683,1.524-1.523,1.524h-18.244v18.579c0,0.84-0.684,1.523-1.524,1.523h-7.209c-0.84,0-1.523-0.683-1.523-1.523v-47.554 c0-0.839,0.683-1.524,1.523-1.524h27.653c0.839,0,1.524,0.684,1.524,1.524v6.48c0,0.84-0.684,1.524-1.524,1.524h-18.92v11.444 H214.269z" />
                                                <path
                                                    d="M109.418,137.706c1.212-1.092,1.798-2.645,1.798-4.749c0-2.096-0.587-3.649-1.798-4.741 c-1.263-1.13-2.928-1.68-5.098-1.68h-5.975v12.848h5.975C106.489,139.385,108.155,138.836,109.418,137.706z" />
                                                <path
                                                    d="M156.139,157.481c1.13-0.424,2.103-1.107,2.973-2.088c0.944-1.055,1.538-2.571,1.769-4.511 c0.26-2.208,0.386-5.091,0.386-8.569c0-3.485-0.126-6.369-0.386-8.569c-0.231-1.946-0.825-3.462-1.762-4.51 c-0.869-0.982-1.873-1.679-2.972-2.089c-1.182-0.453-2.534-0.676-4.042-0.676h-7.164v31.68h7.164 C153.605,158.15,154.965,157.927,156.139,157.481z" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div
                                        className="mt-2 text-xl text-gray-700 italic">{articleInfo.authors.join(', ')}</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mt-4">
                                <div>
                                    <span
                                        className="text-sm font-semibold text-blue-700">Journal:</span> {articleInfo.taskPeriodical}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <div>
                                    <span
                                        className="text-sm font-semibold text-blue-700">Research Area:</span> {articleInfo.taskArea}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <div>
                                    <span
                                        className="text-sm font-semibold text-blue-700">Keywords:</span> {articleInfo.keywords}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <div>
                                    <span
                                        className="text-sm font-semibold text-blue-700">TL;DR:</span> {articleInfo.tldr}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <div>
                                    <span
                                        className="text-sm font-semibold text-blue-700">Abstract:</span> {articleInfo.abstract}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 基于角色的视图 */}
                    <RoleBasedView
                        userRole={userRole}
                        taskName={taskName}
                        editorPeriodical={editorPeriodical}
                        articlePeriodical={articleInfo.taskPeriodical}
                        articleState={articleInfo.state}
                    />
                </div>
            </main>
        </div>
    );
}