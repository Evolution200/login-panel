import { SuperuserMessage } from 'Plugins/SuperuserAPI/SuperuserMessage'

export class FinishManagerMessage extends SuperuserMessage {
    userName: string;
    allowed: boolean;

    constructor(userName: string, allowed: boolean) {
        super();
        this.userName = userName;
        this.allowed = allowed;
    }
}