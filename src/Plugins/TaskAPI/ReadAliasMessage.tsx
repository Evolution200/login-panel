import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'


export class ReadAliasMessage extends TaskMessage {
    taskName: string;
    userName: string;

    constructor(taskName: string, userName: string) {
        super();
        this.taskName = taskName;
        this.userName = userName;
    }
}