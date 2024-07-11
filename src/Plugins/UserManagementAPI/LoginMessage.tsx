import { UserManagementMessage } from 'Plugins/UserManagementAPI/UserManagementMessage'

export class LoginMessage extends UserManagementMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}