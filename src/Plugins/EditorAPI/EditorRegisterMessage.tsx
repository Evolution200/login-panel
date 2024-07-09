import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export interface EditorRegisterInfo {
    userName: string;
    password: string;
    surName: string;
    lastName: string;
    institute: string;
    expertise: string;
    email: string;
    periodical: string;
}

export class EditorRegisterMessage extends EditorMessage {
    editorInfo: EditorRegisterInfo;

    constructor(editorInfo: EditorRegisterInfo) {
        super();
        this.editorInfo = editorInfo;
    }
}