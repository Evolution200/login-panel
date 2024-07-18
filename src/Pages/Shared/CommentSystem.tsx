// CommentSystem.tsx
import React, { useState, useEffect } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { ReadLogListMessage } from 'Plugins/TaskAPI/ReadLogListMessage';
import { useUserStore } from '../../Store/UserStore';
import { AuthorRebuttal } from './AuthorRebuttal';
import { ReadAliasMessage } from 'Plugins/TaskAPI/ReadAliasMessage';
import { ReadAliasTokenMessage } from 'Plugins/TaskAPI/ReadAliasTokenMessage';
import { UserReadInfoMessage } from 'Plugins/UserAPI/UserReadInfoMessage';

interface CommentSystemProps {
    taskName: string;
    isAuthor: boolean;
    userRole: string;
}

interface AliasInfo {
    alias: string;
    aliasToken: string;
}

export function CommentSystem({ taskName, isAuthor, userRole }: CommentSystemProps) {
    const { username } = useUserStore();
    const [logs, setLogs] = useState<LogData[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<LogData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [aliases, setAliases] = useState<{[key: string]: AliasInfo}>({});
    const [editorName, setEditorName] = useState<string>('');

    const canComment = userRole !== 'editor';

    useEffect(() => {
        fetchLogs();
    }, [taskName]);

    const fetchLogs = async () => {
        try {
            const response = await SendPostRequest(new ReadLogListMessage(taskName));
            if (response && response.data) {
                const parsedLogs: LogData[] = JSON.parse(response.data);
                setLogs(parsedLogs);
                await Promise.all([fetchAliases(parsedLogs), fetchEditorName(parsedLogs)]);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    };

    const fetchAliases = async (logs: LogData[]) => {
        const nonEditorLogs = logs.filter(log => log.logType !== 'Decision');
        const aliasPromises = nonEditorLogs.map(log =>
            Promise.all([
                SendPostRequest(new ReadAliasMessage(taskName, log.userName)),
                SendPostRequest(new ReadAliasTokenMessage(taskName, log.userName))
            ])
        );

        const aliasResults = await Promise.all(aliasPromises);
        const newAliases: {[key: string]: AliasInfo} = {};

        aliasResults.forEach((result, index) => {
            const [aliasResponse, aliasTokenResponse] = result;
            if (aliasResponse.data && aliasTokenResponse.data) {
                newAliases[nonEditorLogs[index].userName] = {
                    alias: aliasResponse.data,
                    aliasToken: aliasTokenResponse.data
                };
            }
        });

        setAliases(newAliases);
    };

    const fetchEditorName = async (logs: LogData[]) => {
        const editorLog = logs.find(log => log.logType === 'Decision');
        if (editorLog) {
            const [surNameResponse, lastNameResponse] = await Promise.all([
                SendPostRequest(new UserReadInfoMessage(editorLog.userName, 'sur_name')),
                SendPostRequest(new UserReadInfoMessage(editorLog.userName, 'last_name'))
            ]);
            if (surNameResponse.data && lastNameResponse.data) {
                setEditorName(`${surNameResponse.data} ${lastNameResponse.data}`);
            }
        }
    };

    const getDisplayName = (userName: string, logType: string) => {
        if (logType === 'Decision') {
            return editorName || userName;
        } else {
            const aliasInfo = aliases[userName];
            return aliasInfo ? `${aliasInfo.alias} ${aliasInfo.aliasToken}` : 'Anonymous';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
        setErrorMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') {
            setErrorMessage('Comment cannot be empty');
            return;
        }
        try {
            const newLog: LogData = {
                logType: 'Comment',
                userName: username,
                comment: newComment,
                decision: Decision.None,
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: '',
                rebuttal: '',
                rating: 0,
                confidence: 0
            };
            await SendPostRequest(new AddLogMessage(taskName, newLog));
            setNewComment('');
            fetchLogs();
        } catch (error) {
            console.error('Failed to add comment:', error);
            setErrorMessage('Failed to add comment. Please try again.');
        }
    };

    const getLogTypeColor = (logType: string) => {
        switch (logType) {
            case 'Decision':
                return 'text-blue-700';
            case 'Review':
                return 'text-green-700';
            case 'Comment':
                return 'text-purple-700';
            case 'Rebuttal':
                return 'text-red-700';
            default:
                return 'text-gray-700';
        }
    };

    const handleReplyClick = (log: LogData) => {
        setReplyingTo(log);
    };

    const handleRebuttalAdded = () => {
        setReplyingTo(null);
        fetchLogs();
    };

    const renderLog = (log: LogData, index: number) => {
        const logTypeColor = getLogTypeColor(log.logType);
        const hasRebuttal = log.rebuttal && log.rebuttal !== 'None' && log.rebuttal.trim() !== '';
        const displayName = getDisplayName(log.userName, log.logType);

        return (
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mb-4">
                <div className="min-h-[200px]">
                    <h3 className={`text-xl font-bold mb-2 ${logTypeColor}`}>{log.logType}</h3>
                    <p className="text-sm text-gray-600 mb-2">By: {displayName}</p>
                    {log.logType === 'Decision' && (
                        <div className="mb-2">
                            <span className="font-semibold text-blue-600">Decision:</span> {log.decision}
                        </div>
                    )}
                    {log.logType === 'Review' && (
                        <div className="mb-2">
                            <div><span className="font-semibold text-green-600">Rating:</span> {log.rating}</div>
                            <div><span className="font-semibold text-green-600">Confidence:</span> {log.confidence}</div>
                        </div>
                    )}
                    <div className="mb-2">
                        <span className="font-semibold text-gray-700">Comment:</span>
                        <p className="whitespace-pre-wrap">{log.comment}</p>
                    </div>
                    {log.reasonsToAccept && (
                        <div className="mb-2">
                            <span className="font-semibold text-green-600">Reasons to Accept:</span>
                            <ul className="list-disc list-inside pl-4">
                                {log.reasonsToAccept.split('\n').map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {log.reasonsToReject && (
                        <div className="mb-2">
                            <span className="font-semibold text-red-600">Reasons to Reject:</span>
                            <ul className="list-disc list-inside pl-4">
                                {log.reasonsToReject.split('\n').map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {log.questionsToAuthors && (
                        <div className="mb-2">
                            <span className="font-semibold text-purple-600">Questions to Authors:</span>
                            <ul className="list-disc list-inside pl-4">
                                {log.questionsToAuthors.split('\n').map((question, idx) => (
                                    <li key={idx}>{question}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4 min-h-[100px]">
                        {hasRebuttal && (
                            <div className="bg-red-50 p-3 rounded-md">
                                <h4 className="text-lg font-semibold text-red-700 mb-2">Author's Rebuttal:</h4>
                                <p className="text-gray-800">{log.rebuttal}</p>
                            </div>
                        )}
                        {isAuthor && !hasRebuttal && (
                            <button
                                onClick={() => handleReplyClick(log)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Reply
                            </button>
                        )}
                    </div>
                </div>

                {replyingTo === log && (
                    <div className="mt-4 transition-all duration-300 ease-in-out">
                        <AuthorRebuttal
                            taskName={taskName}
                            originalLog={log}
                            logSeq={index + 1}
                            onRebuttalAdded={handleRebuttalAdded}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">All Comments and Reviews</h3>
            <div className="space-y-4">
                {logs.map((log, index) => (
                    <div key={index}>
                        {renderLog(log, index)}
                    </div>
                ))}
            </div>

            {canComment && (
                <form onSubmit={handleSubmit} className="mt-6">
                    <textarea
                        value={newComment}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows={4}
                        placeholder="Add a comment..."
                    ></textarea>
                    {errorMessage && (
                        <p className="text-red-500 mt-1">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={newComment.trim() === ''}
                    >
                        Add Comment
                    </button>
                </form>
            )}
        </div>
    );
}