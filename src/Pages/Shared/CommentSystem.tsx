import React, { useState, useEffect } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { ReadLogListMessage } from 'Plugins/TaskAPI/ReadLogListMessage';
import { useUserStore } from '../../Store/UserStore';

interface CommentSystemProps {
    taskName: string;
}

export function CommentSystem({ taskName }: CommentSystemProps) {
    const { username } = useUserStore();
    const [logs, setLogs] = useState<LogData[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [taskName]);

    const fetchLogs = async () => {
        try {
            const response = await SendPostRequest(new ReadLogListMessage(taskName));
            if (response && response.data) {
                const parsedLogs: LogData[] = JSON.parse(response.data);
                setLogs(parsedLogs);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newLog: LogData = {
                logType: 'Comment',
                userName: username,
                comment: newComment,
                decision: Decision.None,
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: '',
                rating: 0,
                confidence: 0
            };
            await SendPostRequest(new AddLogMessage(taskName, newLog));
            setNewComment('');
            fetchLogs();
        } catch (error) {
            console.error('Failed to add comment:', error);
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
            default:
                return 'text-gray-700';
        }
    };

    const renderLog = (log: LogData) => {
        const logTypeColor = getLogTypeColor(log.logType);
        return (
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 mb-4">
                <h3 className={`text-xl font-bold mb-2 ${logTypeColor}`}>{log.logType}</h3>
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
                    <span className="font-semibold text-red-400">Comment:</span>
                    <p className="whitespace-pre-wrap">{log.comment}</p>
                </div>
                {log.reasonsToAccept && (
                    <div className="mb-2">
                        <span className="font-semibold text-green-600">Pros:</span>
                        <ul className="list-disc list-inside pl-4">
                            {log.reasonsToAccept.split('\n').map((reason, index) => (
                                <li key={index}>{reason}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {log.reasonsToReject && (
                    <div className="mb-2">
                        <span className="font-semibold text-red-600">Cons:</span>
                        <ul className="list-disc list-inside pl-4">
                            {log.reasonsToReject.split('\n').map((reason, index) => (
                                <li key={index}>{reason}</li>
                            ))}
                        </ul>
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
                        {renderLog(log)}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
                <textarea
                    value={newComment}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Add a comment..."
                ></textarea>
                <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Comment
                </button>
            </form>
        </div>
    );
}