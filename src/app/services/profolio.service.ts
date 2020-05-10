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

  constructor(
    private db: AngularFirestore,
    private user: UserService,
    public toastController: ToastController
  ) { 
    this.profoliosCollection = this.db.collection('profolios');
    this.profolios = this.profoliosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        })
      })
    );
  }

  getProfolios() {
    return this.profolios
  }

  getProfoliosForExploreTab() {
    return this.profoliosCollection.ref.limit(3).get();
  }

  getProfolio(uid: string) {
    return this.profoliosCollection.doc<Profolio>(uid).valueChanges();
  }

  updateProfolio(profolio: Profolio, id: string) {
    return this.profoliosCollection.doc(this.user.getUID()).update(profolio)
    .then(result => {
      this.presentToastWithOptions('Profolio updated successfully!', 'success')
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'error')
    });
  }

  addProfolio(profolio: Profolio) {
    this.profoliosCollection.doc(this.user.getUID()).set({...profolio})
    .then(result => {
      this.presentToastWithOptions('Profolio created successfully!', 'success')
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'error')
    });
  }

  deleteProfolio(id) {
    this.profoliosCollection.doc(this.user.getUID()).delete();
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
