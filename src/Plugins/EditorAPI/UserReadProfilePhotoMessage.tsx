import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export class UserReadProfilePhotoMessage extends EditorMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}