import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserReadInfoMessage extends UserMessage {
    userName: string;
    property: string;

    constructor(userName: string, property: string) {
        super();
        this.userName = userName;
        this.property = property;
    }
}