import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export class EditorEditInfoMessage extends EditorMessage {
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