import React from 'react';
import { DecisionLog } from './DecisionLog';
import { ReviewLog } from './ReviewLog';
import { CommentSystem } from './CommentSystem';

interface RoleBasedViewProps {
    userRole: string;
    taskName: string;
    editorPeriodical: string;
    articlePeriodical: string;
}

export function RoleBasedView({ userRole, taskName, editorPeriodical, articlePeriodical }: RoleBasedViewProps) {
    const canDecide = userRole === 'editor' && editorPeriodical === articlePeriodical;
    const canReview = userRole === 'reviewer';

    return (
        <div>
            <div>
                <CommentSystem taskName={taskName} />
            </div>
            {canDecide && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Editor Decision</h2>
                    <DecisionLog taskName={taskName} onLogAdded={() => {
                    }} />
                </div>
            )}
            {canReview && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Reviewer Feedback</h2>
                    <ReviewLog taskName={taskName} onLogAdded={() => {
                    }} />
                </div>
            )}
        </div>
    );
}