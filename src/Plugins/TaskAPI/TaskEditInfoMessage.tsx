import { TaskMessage } from 'Plugins/TaskAPI/TaskMessage'


export class TaskEditInfoMessage extends TaskMessage {
    taskName: string;
    property: string;
    updateValue: string;


    constructor(taskName:string, property:string, updateValue:string) {
        super();
        this.taskName = taskName;
        this.property = property;
        this.updateValue = updateValue;
    }
}