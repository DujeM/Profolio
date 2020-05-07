import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

interface User {
    email: string,
    uid: string
}

@Injectable()
export class UserService {
    public user: User;
    public uid: string;
    constructor(
        private storage: Storage,
        private http: HttpClient,
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

    getAllCountries() {
        return this.http.get('https://restcountries.eu/rest/v2/all');
    }

    getAllCurrencies() {
        return this.http.get('https://openexchangerates.org/api/currencies.json');
    }
}