import React from 'react';
import { DecisionLog } from './DecisionLog';
import { ReviewLog } from './ReviewLog';
import { CommentSystem } from './CommentSystem';

interface RoleBasedViewProps {
    userRole: string;
    taskName: string;
    editorPeriodical: string;
    articlePeriodical: string;
    articleState: string;
    refreshPage: () => void;
}

export function RoleBasedView({
                                  userRole,
                                  taskName,
                                  editorPeriodical,
                                  articlePeriodical,
                                  articleState,
                                  refreshPage
                              }: RoleBasedViewProps) {
    const canDecide = userRole === 'editor' && editorPeriodical === articlePeriodical;
    const canReview = userRole === 'reviewer' && articleState === 'Review';
    const isAuthor = userRole === 'author';

    return (
        <div>
            <div>
                <CommentSystem
                    taskName={taskName}
                    isAuthor={isAuthor}
                    userRole={userRole}
                    editorPeriodical={editorPeriodical}
                    articlePeriodical={articlePeriodical}
                />
            </div>
            {canDecide && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Editor Decision</h2>
                    <DecisionLog
                        taskName={taskName}
                        onLogAdded={refreshPage}
                        articleState={articleState}
                    />
                </div>
            )}
            {canReview && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Reviewer Feedback</h2>
                    <ReviewLog taskName={taskName} onLogAdded={() => {}} />
                </div>
            )}
        </div>
    );
}