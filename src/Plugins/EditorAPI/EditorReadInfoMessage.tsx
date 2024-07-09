import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export class EditorReadInfoMessage extends EditorMessage {
    userName: string;
    property: string;

    constructor(userName: string, property: string) {
        super();
        this.userName = userName;
        this.property = property;
    }
}