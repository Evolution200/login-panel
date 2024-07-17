import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'

export class ReadPeriodicalTaskListMessage extends TaskMessage {
    periodicalName:string;

    constructor(periodicalName:string) {
        super();
        this.periodicalName = periodicalName;
    }
}