import { UserManagementMessage } from 'Plugins/UserManagementAPI/UserManagementMessage'

export class EditPasswordMessage extends UserManagementMessage {
    userName: string;
    oldPassword: string;
    newPassword: string;

    constructor(userName: string, oldPassword: string, newPassword: string) {
        super();
        this.userName = userName;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}