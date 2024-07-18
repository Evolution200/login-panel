// AuthorRebuttal.tsx
import React, { useState } from 'react';
import { SendPostRequest } from '../../Common/SendPost';
import { AddRebuttalMessage } from 'Plugins/TaskAPI/AddRebuttalMessage';
import { LogData } from 'Plugins/TaskAPI/AddLogMessage';

interface AuthorRebuttalProps {
    taskName: string;
    originalLog: LogData;
    logSeq: number;
    onRebuttalAdded: () => void;
}

export function AuthorRebuttal({ taskName, originalLog, logSeq, onRebuttalAdded }: AuthorRebuttalProps) {
    const [rebuttal, setRebuttal] = useState('');

    const handleRebuttalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRebuttal(e.target.value);
    };

    const handleSubmitRebuttal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const rebuttalMessage = new AddRebuttalMessage(taskName, logSeq.toString(), rebuttal);
            await SendPostRequest(rebuttalMessage);
            setRebuttal('');
            onRebuttalAdded();
        } catch (error) {
            console.error('Failed to add rebuttal:', error);
        }
    };

    return (
        <form onSubmit={handleSubmitRebuttal} className="mt-4">
            <textarea
                value={rebuttal}
                onChange={handleRebuttalChange}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Write your rebuttal here..."
            ></textarea>
            <button type="submit" className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                Submit Rebuttal
            </button>
        </form>
    );
}