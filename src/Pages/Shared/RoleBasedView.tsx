// RoleBasedView.tsx
import React from 'react';
import { DecisionLog } from './DecisionLog';
import { ReviewLog } from './ReviewLog';
import { CommentSystem } from './CommentSystem';

interface RoleBasedViewProps {
    userRole: string;
    taskName: string;
    editorPeriodical: string;
    articlePeriodical: string;
    articleState: string;  // 添加这个属性
}

export function RoleBasedView({
                                  userRole,
                                  taskName,
                                  editorPeriodical,
                                  articlePeriodical,
                                  articleState
                              }: RoleBasedViewProps) {
    const canDecide = userRole === 'editor' && editorPeriodical === articlePeriodical;
    const canReview = userRole === 'reviewer' && articleState === 'Review';  // 修改这行
    const isAuthor = userRole === 'author';

    return (
        <div>
            <div>
                <CommentSystem taskName={taskName} isAuthor={isAuthor} userRole={userRole} />
            </div>
            {canDecide && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Editor Decision</h2>
                    <DecisionLog taskName={taskName} onLogAdded={() => {}} />
                </div>
            )}
            {canReview ? (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Reviewer Feedback</h2>
                    <ReviewLog taskName={taskName} onLogAdded={() => {}} />
                </div>
            ) : userRole === 'reviewer' && (
                <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                    The article is not in the Review state. You cannot submit a review at this time.
                </div>
            )}
        </div>
    );
}