import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserSubmissionMessage extends UserMessage {
    userName: string;
    taskName: string;
    periodicalName: string;
    pdfBase64: string

    constructor(userName: string, taskName: string, periodicalName: string, pdfBase64: string) {
        super();
        this.userName = userName;
        this.taskName = taskName;
        this.periodicalName = periodicalName;
        this.pdfBase64 = pdfBase64;
    }
}