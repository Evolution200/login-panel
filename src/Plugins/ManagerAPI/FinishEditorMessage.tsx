import { ManagerMessage } from 'Plugins/ManagerAPI/ManagerMessage'

export class FinishEditorMessage extends ManagerMessage {
    userName: string;
    allowed: boolean;

    constructor(userName: string, allowed: boolean) {
        super();
        this.userName = userName;
        this.allowed = allowed;
    }
}