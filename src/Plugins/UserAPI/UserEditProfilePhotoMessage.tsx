import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserEditProfilePhotoMessage extends UserMessage {
    userName: string;
    Base64Image: string

    constructor(userName: string, Base64Image: string) {
        super();
        this.userName = userName;
        this.Base64Image = Base64Image;
    }
}