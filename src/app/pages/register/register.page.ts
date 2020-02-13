import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string;
  password: string;
  cpassword: string;

  constructor(
    private auth: AngularFireAuth,
    private afstore: AngularFirestore,
    private user: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async register() {
    const { email, password, cpassword } = this;

    if (password != cpassword) {
      return console.error("Passwords don't match!");
    }

    try {
      const res = await this.auth.createUserWithEmailAndPassword(email, password);

      this.afstore.doc(`users/${res.user.uid}`).set({
        email
      });

      this.user.setUser({
        email,
        uid: res.user.uid
      });
      console.log("Success account registered!")
      this.router.navigateByUrl('tabs')
    } catch (error) {
      console.dir(error);
    }
  }

}
