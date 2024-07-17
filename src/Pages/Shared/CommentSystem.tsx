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

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Comments and Reviews</h3>
            <div className="space-y-4">
                {logs.map((log, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold">{log.userName} - {log.logType}</p>
                        <p>{log.comment}</p>
                        {log.logType === 'Decision' && log.decision !== Decision.None && (
                            <>
                                <p>Decision: {log.decision}</p>
                                <p>Reasons to Accept: {log.reasonsToAccept}</p>
                                <p>Reasons to Reject: {log.reasonsToReject}</p>
                                <p>Questions to Authors: {log.questionsToAuthors}</p>
                            </>
                        )}
                        {log.logType === 'Review' && (
                            <>
                                <p>Rating: {log.rating}</p>
                                <p>Confidence: {log.confidence}</p>
                            </>
                        )}
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