import { ManagerMessage } from 'Plugins/ManagerAPI/ManagerMessage'

export class ManagerLoginMessage extends ManagerMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}