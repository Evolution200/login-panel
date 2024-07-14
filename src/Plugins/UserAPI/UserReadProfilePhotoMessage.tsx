import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserReadProfilePhotoMessage extends UserMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}