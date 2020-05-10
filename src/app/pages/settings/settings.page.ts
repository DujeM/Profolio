import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  logout() {
    this.auth.signOut().then(() => {
        this.router.navigate(['/login']);
    })
  }

}
