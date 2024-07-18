// DecisionLog.tsx
import React, { useState, useEffect } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddLogMessage, LogData, Decision } from 'Plugins/TaskAPI/AddLogMessage';
import { TaskEditInfoMessage } from 'Plugins/TaskAPI/TaskEditInfoMessage';
import { ReadTaskInfoMessage } from 'Plugins/TaskAPI/ReadTaskInfoMessage';
import { useUserStore } from '../../Store/UserStore';

interface DecisionLogProps {
    taskName: string;
    onLogAdded: () => void;
}

export function DecisionLog({ taskName, onLogAdded }: DecisionLogProps) {
    const { username } = useUserStore();
    const [canAddDecision, setCanAddDecision] = useState(false);
    const [newLog, setNewLog] = useState<LogData>({
        logType: 'Decision',
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
                setCanAddDecision(response.data === 'init');
            }
        } catch (error) {
            console.error('Failed to check task state:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({
            ...prev,
            [name]: name === 'decision' ? value as Decision : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canAddDecision) {
            alert("You can't add a decision because the article state is no longer 'init'.");
            return;
        }
        try {
            await SendPostRequest(new AddLogMessage(taskName, newLog));
            await SendPostRequest(new TaskEditInfoMessage(taskName, 'state', newLog.decision));
            setNewLog({
                ...newLog,
                comment: '',
                decision: Decision.None,
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: '',
                rebuttal: ''
            });
            onLogAdded();
            setCanAddDecision(false);
        } catch (error) {
            console.error('Failed to add decision log:', error);
        }
    };

    if (!canAddDecision) {
        return (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                A decision has already been made for this article. No further decisions can be added.
            </div>
        );
    }

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
                    <option value={Decision.None}>Select a decision</option>
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
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={newLog.decision === Decision.None}
            >
                Submit Decision
            </button>
        </form>
    );
}