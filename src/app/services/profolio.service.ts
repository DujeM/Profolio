import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Profolio } from '../models/profolio';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { UserService } from '../services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ProfolioService {
  private profoliosCollection: AngularFirestoreCollection<Profolio>;
  private profolios: Observable<Profolio[]>;
  currentUser: any;

  constructor(
    private db: AngularFirestore,
    private user: UserService,
    public toastController: ToastController
  ) { 
    this.currentUser = this.user.getUID();
    this.profoliosCollection = this.db.collection('users').doc(this.currentUser).collection<Profolio>('profolios');
    this.profolios = this.profoliosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        })
      })
    )
  }

  getProfolios() {
    return this.profolios;
  }

  getProfolio(id) {
    return this.profoliosCollection.doc<Profolio>(id).valueChanges();
  }

  updateProfolio(profolio: Profolio, id: string) {
    return this.profoliosCollection.doc(id).update(profolio)
    .then(result => {
      this.presentToastWithOptions('Profolio updated successfully!', 'success')
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'error')
    });
  }

  addProfolio(profolio: Profolio) {
    this.profoliosCollection.add({...profolio})
    .then(result => {
      this.presentToastWithOptions('Profolio created successfully!', 'success')
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'error')
    });
  }

  deleteProfolio(id) {
    this.profoliosCollection.doc(id).delete();
  }

  async presentToastWithOptions(msg: string, type:string) {
    const toast = await this.toastController.create({
      header: 'Profolio ' + type,
      message: msg,
      position: 'top',
      duration: 3000,
      color: type,
      buttons: [
        {
          side: 'end',
          text: 'Hide',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }
  
}
