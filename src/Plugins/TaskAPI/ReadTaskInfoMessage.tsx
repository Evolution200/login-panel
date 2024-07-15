import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class ReadTaskInfoMessage extends TaskMessage {
    taskName: string;
    property: string;

    constructor(taskName: string, property: string) {
        super();
        this.taskName = taskName;
        this.property = property;
    }
}