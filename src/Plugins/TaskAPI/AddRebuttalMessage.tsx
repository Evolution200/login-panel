import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class AddRebuttalMessage extends TaskMessage {
    taskName: string;
    log_seq: string;
    rebuttal: string;

    constructor(taskName:string, log_seq:string, rebuttal:string) {
        super();
        this.taskName = taskName;
        this.log_seq = log_seq;
        this.rebuttal = rebuttal;
    }
}