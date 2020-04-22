import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

interface User {
    email: string,
    uid: string
}

@Injectable()
export class UserService {
    public user: User;
    public uid: string;
    constructor(
        private storage: Storage
    ) {}

    setUser(user: User) {
        this.user = user
        this.storage.set('uid', this.user.uid).then(res => {
            this.getUIDFromStorage();
        });
    }

    async getUIDFromStorage() {
        await this.storage.get('uid').then((val) => {
            this.uid = val;
            return val
        });
    }

    getUID() {
        return this.uid;
    }
}