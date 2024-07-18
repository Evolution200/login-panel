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
    articleState: string;
}

export function DecisionLog({ taskName, onLogAdded, articleState }: DecisionLogProps) {
    const { username } = useUserStore();
    const [canMakeDecision, setCanMakeDecision] = useState(false);
    const [isFirstDecision, setIsFirstDecision] = useState(true);
    const [decision, setDecision] = useState<Decision>(Decision.None);
    const [comment, setComment] = useState('');

    useEffect(() => {
        checkDecisionState();
    }, [articleState]);

    const checkDecisionState = async () => {
        try {
            const response = await SendPostRequest(new ReadTaskInfoMessage(taskName, 'state'));
            if (response && response.data) {
                setCanMakeDecision(response.data === 'init' || response.data === 'Review');
                setIsFirstDecision(response.data === 'init');
            }
        } catch (error) {
            console.error('Failed to check task state:', error);
        }
    };

    const handleDecision = async (selectedDecision: Decision) => {
        if (!canMakeDecision) return;

        try {
            const newLog: LogData = {
                logType: 'Decision',
                userName: username,
                comment: comment,
                decision: selectedDecision,
                reasonsToAccept: '',
                reasonsToReject: '',
                questionsToAuthors: '',
                rebuttal: '',
                rating: 0,
                confidence: 0
            };

            await SendPostRequest(new AddLogMessage(taskName, newLog));
            await SendPostRequest(new TaskEditInfoMessage(taskName, 'state', selectedDecision));

            setDecision(selectedDecision);
            if (selectedDecision === Decision.Review) {
                setCanMakeDecision(true);
                setIsFirstDecision(false);
            } else {
                setCanMakeDecision(false);
            }
            onLogAdded();  // 调用此函数来刷新页面
        } catch (error) {
            console.error('Failed to add decision log:', error);
        }
    };

    if (!canMakeDecision && decision === Decision.None) {
        return (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                You cannot make a decision at this time.
            </div>
        );
    }

    if (!canMakeDecision && decision !== Decision.None) {
        return (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                You have made your final decision: {decision}. This decision cannot be changed.
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Make a Decision</h3>
            <div>
                <label className="block mb-1">Comment</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                ></textarea>
            </div>
            <div className="flex space-x-4">
                {isFirstDecision ? (
                    <>
                        <button
                            onClick={() => handleDecision(Decision.Review)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Review
                        </button>
                        <button
                            onClick={() => handleDecision(Decision.Revise)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Revise
                        </button>
                        <button
                            onClick={() => handleDecision(Decision.Reject)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Reject
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleDecision(Decision.Revise)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Revise
                        </button>
                        <button
                            onClick={() => handleDecision(Decision.Reject)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => handleDecision(Decision.Accepted)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Accept
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}