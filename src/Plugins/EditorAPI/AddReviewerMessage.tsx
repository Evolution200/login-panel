import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'


export class AddReviewerMessage extends EditorMessage {
    userName: string
    Periodical: string


    constructor(userName: string, Periodical: string) {
        super();
        this.userName = userName;
        this.Periodical = Periodical;
    }
}