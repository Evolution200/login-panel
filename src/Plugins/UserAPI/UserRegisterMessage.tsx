// UserRegisterMessage.tsx
import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export interface UserRegisterInfo {
    userName: string;
    password: string;
    surName: string;
    lastName: string;
    institute: string;
    expertise: string;
    email: string;
}

export class UserRegisterMessage extends UserMessage {
    userInfo: UserRegisterInfo;

    constructor(userInfo: UserRegisterInfo) {
        super();
        this.userInfo = userInfo;
    }
}