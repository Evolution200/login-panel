import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export class UserEditProfilePhotoMessage extends EditorMessage {
    userName: string;
    Base64Image: string

    constructor(userName: string, Base64Image: string) {
        super();
        this.userName = userName;
        this.Base64Image = Base64Image;
    }
}