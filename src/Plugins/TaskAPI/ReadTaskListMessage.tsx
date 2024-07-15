import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class ReadTaskListMessage extends TaskMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}