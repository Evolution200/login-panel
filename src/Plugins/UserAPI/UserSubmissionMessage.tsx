import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export class UserSubmissionMessage extends UserMessage {
    userName: string;
    taskName: string;
    periodicalName: string;
    pdfBase64: string;
    researchArea: string;
    Abstract: string;
    TLDR: string;

    constructor(userName:string, taskName:string, periodicalName:string, pdfBase64:string, researchArea:string, Abstract:string, TLDR:string) {
        super();
        this.userName = userName;
        this.taskName = taskName;
        this.periodicalName = periodicalName;
        this.pdfBase64 = pdfBase64;
        this.researchArea = researchArea;
        this.Abstract = Abstract;
        this.TLDR = TLDR;
    }
}