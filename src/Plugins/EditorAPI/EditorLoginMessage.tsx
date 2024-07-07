import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export class EditorLoginMessage extends EditorMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}