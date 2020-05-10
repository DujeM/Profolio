import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  loading: boolean = true;
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private user: UserService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.auth.currentUser.then(user => {
      if (user) {
        this.user.getUserUID().then(() => {
          this.router.navigateByUrl('tabs')
        });  
      } else {
        this.loading = false;
      }
    })
  }

  async login() {
    const { email, password } = this;
    try {
      const res = await this.auth.signInWithEmailAndPassword(email, password)
      if (res.user) {
        this.user.getUserUID().then(() => {
          this.router.navigateByUrl('tabs')
        });
      }
    } catch (error) {
      console.dir(error)
    }
  }
}
