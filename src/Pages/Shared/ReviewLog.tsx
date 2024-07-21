import React, { useState, useEffect } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { useUserStore } from '../../Store/UserStore';

interface ReviewLogProps {
    taskName: string;
    onLogAdded: () => void;
}

export function ReviewLog({ taskName, onLogAdded }: ReviewLogProps) {
    const { username } = useUserStore();
    const [canSubmitReview, setCanSubmitReview] = useState(false);
    const [newLog, setNewLog] = useState<LogData>({
        logType: 'Review',
        userName: username,
        comment: '',
        decision: Decision.None,
        reasonsToAccept: '',
        reasonsToReject: '',
        questionsToAuthors: '',
        rebuttal: '',
        rating: 0,
        confidence: 0
    });

    useEffect(() => {
        checkTaskState();
    }, [taskName]);

    const checkTaskState = async () => {
        try {
            const response = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'state'));
            if (response && response.data) {
                setCanSubmitReview(response.data === 'Review');  // 修改这里，使用大写的 'Review'
            }
        } catch (error) {
            console.error('Failed to check task state:', error);
        }
    };

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
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: '',
                rating: 0,
                confidence: 0,
                rebuttal: ''
            });
            onLogAdded();
        } catch (error) {
            console.error('Failed to add review log:', error);
        }
    };

    if (!canSubmitReview) {
        return (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                The article is not in the Review state. You cannot submit a review at this time.
            </div>
        );
    }

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
                    required
                ></textarea>
            </div>
            <div>
                <label className="block mb-1">Reasons to Accept</label>
                <textarea
                    name="reasonsToAccept"
                    value={newLog.reasonsToAccept}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                ></textarea>
            </div>
            <div>
                <label className="block mb-1">Reasons to Reject</label>
                <textarea
                    name="reasonsToReject"
                    value={newLog.reasonsToReject}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
                ></textarea>
            </div>
            <div>
                <label className="block mb-1">Questions to Authors</label>
                <textarea
                    name="questionsToAuthors"
                    value={newLog.questionsToAuthors}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    required
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
                    required
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
                    required
                />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Submit Review
            </button>
        </form>
    );
}