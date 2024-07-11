import { ManagerMessage } from 'Plugins/ManagerAPI/ManagerMessage'

export class AddPeriodicalMessage extends ManagerMessage {
    periodical: string

    constructor(periodical: string) {
        super();
        this.periodical = periodical;
    }
}