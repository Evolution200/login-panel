import React, { useState, useEffect } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { ReadLogListMessage } from 'Plugins/TaskAPI/ReadLogListMessage';
import { useUserStore } from '../../Store/UserStore';

interface CommentSystemProps {
    taskName: string;
}

export function CommentSystem({ taskName }: CommentSystemProps) {
    const { username, role } = useUserStore();
    const [logs, setLogs] = useState<LogData[]>([]);
    const [newLog, setNewLog] = useState<LogData>({
        logType: 'Comment',
        userName: username,
        comment: '',
        decision: Decision.Review,
        reasonsToAccept: '',
        reasonsToReject: '',
        questionsToAuthors: '',
        rating: 0,
        confidence: 0
    });

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => {
            if (name === 'rating' || name === 'confidence') {
                return { ...prev, [name]: parseInt(value) || 0 };
            }
            if (name === 'decision') {
                return { ...prev, [name]: value as Decision };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await SendPostRequest(new AddLogMessage(taskName, newLog));
            setNewLog({
                logType: 'Comment',
                userName: username,
                comment: '',
                decision: Decision.Review,
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: '',
                rating: 0,
                confidence: 0
            });
            fetchLogs();
        } catch (error) {
            console.error('Failed to add log:', error);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Comments and Reviews</h3>
            <div className="space-y-4">
                {logs.map((log, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-lg">
                        {log.logType === 'Comment' ? (
                            <>
                                <p className="font-semibold">{log.logType}</p>
                                <p>{log.comment}</p>
                            </>
                        ) : (
                            <>
                                <p className="font-semibold">{log.userName} - {log.logType}</p>
                                <p>{log.comment}</p>
                                {log.logType === 'Decision' && (
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
                            </>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label className="block mb-1">Log Type</label>
                    <select
                        name="logType"
                        value={newLog.logType}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Comment">Comment</option>
                        <option value="Review">Review</option>
                        {role !== 'user' && <option value="Decision">Decision</option>}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Comment</label>
                    <textarea
                        name="comment"
                        value={newLog.comment}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows={4}
                    ></textarea>
                </div>
                {newLog.logType === 'Decision' && (
                    <>
                        <div>
                            <label className="block mb-1">Decision</label>
                            <select
                                name="decision"
                                value={newLog.decision}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                {Object.values(Decision).map(decision => (
                                    <option key={decision} value={decision}>{decision}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Reasons to Accept</label>
                            <textarea
                                name="reasonsToAccept"
                                value={newLog.reasonsToAccept}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows={2}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block mb-1">Reasons to Reject</label>
                            <textarea
                                name="reasonsToReject"
                                value={newLog.reasonsToReject}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows={2}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block mb-1">Questions to Authors</label>
                            <textarea
                                name="questionsToAuthors"
                                value={newLog.questionsToAuthors}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows={2}
                            ></textarea>
                        </div>
                    </>
                )}
                {newLog.logType === 'Review' && (
                    <>
                        <div>
                            <label className="block mb-1">Rating</label>
                            <input
                                type="number"
                                name="rating"
                                value={newLog.rating}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Confidence</label>
                            <input
                                type="number"
                                name="confidence"
                                value={newLog.confidence}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                max="10"
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </div>
    );
}