// UserRegisterMessage.tsx
import { UserMessage } from 'Plugins/UserAPI/UserMessage'

export interface UserRegisterInfo {
    userName: string;
    surName: string;
    lastName: string;
    institute: string;
    expertise: string;
    email: string;
}

export class UserRegisterMessage extends UserMessage {
    userInfo: UserRegisterInfo;
    password: string;

    constructor(userInfo: UserRegisterInfo, password: string) {
        super();
        this.userInfo = userInfo;
        this.password = password;
    }
}