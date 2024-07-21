import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export interface EditorRegisterInfo {
    userName: string;
    surName: string;
    lastName: string;
    institute: string;
    expertise: string;
    email: string;
    periodical: string;
}

export class EditorRegisterMessage extends EditorMessage {
    editorInfo: EditorRegisterInfo;
    password: string

    constructor(editorInfo: EditorRegisterInfo, password: string) {
        super();
        this.editorInfo = editorInfo;
        this.password = password;
    }
}