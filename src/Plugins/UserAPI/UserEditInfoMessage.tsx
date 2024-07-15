import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserEditInfoMessage extends UserMessage {
    userName: string;
    property: string;
    updateValue: string;

    constructor(userName: string, property: string, updateValue: string) {
        super();
        this.userName = userName;
        this.property = property;
        this.updateValue = updateValue;
    }
}