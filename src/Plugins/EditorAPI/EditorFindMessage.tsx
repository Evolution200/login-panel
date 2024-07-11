import { EditorMessage } from 'Plugins/EditorAPI/EditorMessage'

export class EditorFindMessage extends EditorMessage {
    periodical: string

    constructor(periodical: string) {
        super();
        this.periodical = periodical;
    }
}