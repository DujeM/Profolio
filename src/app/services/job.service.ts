import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { UserService } from '../services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsCollection: AngularFirestoreCollection<Job>;
  private usersCollection: AngularFirestoreCollection;
  private jobs: Observable<Job[]>;
  currentUser: any;

  constructor(
    private db: AngularFirestore,
    private user: UserService,
    public toastController: ToastController
  ) { 
    this.currentUser = this.user.getUID();
    console.log(this.currentUser)
    this.jobsCollection = this.db.collection('jobs');
    this.usersCollection = this.db.collection('users').doc(this.currentUser).collection('created_jobs');
    this.jobs = this.jobsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        })
      })
    );
  }

  getUserCreatedJobs() {
    return this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data }
        })
      })
    );
  }

  getUserCreatedJobById(id) {
    return this.usersCollection.doc<Job>(id).valueChanges();
  }

  getJob(id) {
    return this.jobsCollection.doc<Job>(id).valueChanges();
  }

  updateJob(job: Job, id: string) {
    return this.jobsCollection.doc(id).update(job)
    .then(result => {
      this.usersCollection.doc(id).update(job).then(res => {
        this.presentToastWithOptions('Job updated successfully!', 'success')
      });
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'error')
    });
  }

  addJob(job: Job) {
    this.jobsCollection.add({...job})
    .then(result => {
      console.log(result)
      this.usersCollection.doc(result.id).set({...job}).then(res => {
        this.presentToastWithOptions('Job created successfully!', 'success')
      });
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'danger')
    });
  }

  deleteJob(id) {
    this.jobsCollection.doc(id).delete().then(res => {
      this.usersCollection.doc(id).delete().then(res => {
        this.presentToastWithOptions('Job deleted successfully!', 'success')
      });
    });
  }

  async presentToastWithOptions(msg: string, type:string) {
    const toast = await this.toastController.create({
      header: 'Job ' + type,
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

