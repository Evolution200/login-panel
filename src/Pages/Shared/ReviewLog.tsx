import React, { useState } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { useUserStore } from '../../Store/UserStore';

interface ReviewLogProps {
    taskName: string;
    onLogAdded: () => void;
}

export function ReviewLog({ taskName, onLogAdded }: ReviewLogProps) {
    const { username } = useUserStore();
    const [newLog, setNewLog] = useState<LogData>({
        logType: 'Decision', // 或 'Review'
        userName: username,
        comment: '',
        decision: Decision.None,
        reasonsToAccept: '',
        reasonsToReject: '',
        questionsToAuthors: '',
        rebuttal: '',  // 确保这里是空字符串
        rating: 0,
        confidence: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({
            ...prev,
            [name]: name === 'rating' || name === 'confidence' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await SendPostRequest(new AddLogMessage(taskName, newLog));
            setNewLog({
                ...newLog,
                comment: '',
                rating: 0,
                confidence: 0,
                rebuttal: '' // 添加这一行
            });
            onLogAdded();
        } catch (error) {
            console.error('Failed to add review log:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Submit Review</h3>
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
            <div>
                <label className="block mb-1">Rating (0-10)</label>
                <input
                    type="number"
                    name="rating"
                    value={newLog.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label className="block mb-1">Confidence (0-10)</label>
                <input
                    type="number"
                    name="confidence"
                    value={newLog.confidence}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    className="w-full p-2 border rounded"
                />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Submit Review
            </button>
        </form>
    );
}