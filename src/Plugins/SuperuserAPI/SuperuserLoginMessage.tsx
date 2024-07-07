import { SuperuserMessage } from 'Plugins/SuperuserAPI/SuperuserMessage'

export class SuperuserLoginMessage extends SuperuserMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}