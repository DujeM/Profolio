import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

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
        private auth: AngularFireAuth
    ) {}

    getUID() {
        return this.uid;
    }

    getUserUID() {
        return this.auth.onAuthStateChanged(result => {
            if (result) {
                this.uid = result.uid;
            }
        });
    }

    getAllCountries() {
        return this.http.get('https://restcountries.eu/rest/v2/all');
    }

    getAllCurrencies() {
        return this.http.get('https://openexchangerates.org/api/currencies.json');
    }
}