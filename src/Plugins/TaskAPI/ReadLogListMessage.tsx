import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class ReadLogListMessage extends TaskMessage {
    taskName: string;

    constructor(taskName: string) {
        super();
        this.taskName = taskName;
    }
}