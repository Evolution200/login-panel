import React, { useState } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { TaskEditInfoMessage } from 'Plugins/TaskAPI/TaskEditInfoMessage';
import { useUserStore } from '../../Store/UserStore';

interface DecisionLogProps {
    taskName: string;
    onLogAdded: () => void;
}

export function DecisionLog({ taskName, onLogAdded }: DecisionLogProps) {
    const { username } = useUserStore();
    const [newLog, setNewLog] = useState<LogData>({
        logType: 'Decision',
        userName: username,
        comment: '',
        decision: Decision.Review,
        reasonsToAccept: '',
        reasonsToReject: '',
        questionsToAuthors: '',
        rating: 0,
        confidence: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({
            ...prev,
            [name]: name === 'decision' ? value as Decision : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await SendPostRequest(new AddLogMessage(taskName, newLog));
            await SendPostRequest(new TaskEditInfoMessage(taskName, 'state', newLog.decision));
            setNewLog({
                ...newLog,
                comment: '',
                decision: Decision.Review,
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: ''
            });
            onLogAdded();
        } catch (error) {
            console.error('Failed to add decision log:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Make a Decision</h3>
            <div>
                <label className="block mb-1">Decision</label>
                <select
                    name="decision"
                    value={newLog.decision}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                >
                    <option value={Decision.Review}>Review</option>
                    <option value={Decision.Revise}>Revise</option>
                    <option value={Decision.Reject}>Reject</option>
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit Decision
            </button>
        </form>
    );
}