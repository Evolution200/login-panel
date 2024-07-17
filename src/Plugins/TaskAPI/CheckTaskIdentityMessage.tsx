import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class CheckTaskIdentityMessage extends TaskMessage {
    taskName: string;
    userName: string;

    constructor(taskName:string, userName:string, identity:string) {
        super();
        this.taskName = taskName;
        this.userName = userName;
    }
}