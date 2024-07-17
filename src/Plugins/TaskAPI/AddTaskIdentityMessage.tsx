import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class AddTaskIdentityMessage extends TaskMessage {
    taskName: string;
    userName: string;
    identity: string;

    constructor(taskName:string, userName:string, identity:string) {
        super();
        this.taskName = taskName;
        this.userName = userName;
        this.identity = identity;
    }
}