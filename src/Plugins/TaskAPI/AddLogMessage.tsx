import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export enum Decision {
    Review = 'Review',
    Reject = 'Reject',
    Revise = 'Revise',
    None = 'None',
    Accepted = 'Accepted',
}

export interface LogData {
    logType: string;
    userName: string;
    comment: string;
    decision: Decision;
    reasonsToAccept: string;
    reasonsToReject: string;
    questionsToAuthors: string;
    rebuttal: string;
    rating: number;
    confidence: number;
}

export class AddLogMessage extends TaskMessage {
    taskName: string;
    log: LogData;

    constructor(taskName: string, log: LogData) {
        super();
        this.taskName = taskName;
        this.log = log;
    }
}