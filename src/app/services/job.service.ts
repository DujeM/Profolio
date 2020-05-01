import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Job } from '../models/job';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators'
import { UserService } from '../services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsCollection: AngularFirestoreCollection<Job>;
  private usersCreatedJobsCollection: AngularFirestoreCollection;
  private usersFollowedJobsCollection: AngularFirestoreCollection;
  private jobs: Observable<Job[]>;
  currentUser: any;

  constructor(
    private db: AngularFirestore,
    private user: UserService,
    public toastController: ToastController
  ) { 
    this.currentUser = this.user.getUID();
    this.jobsCollection = this.db.collection('jobs');
    this.usersCreatedJobsCollection = this.db.collection('users').doc(this.currentUser).collection('created_jobs');
    this.usersFollowedJobsCollection = this.db.collection('users').doc(this.currentUser).collection('following_jobs');
  }

  getUserCreatedJobs() {
    return this.usersCreatedJobsCollection.valueChanges();
  }

  getUserFollowingJobs() {
    return this.usersFollowedJobsCollection.valueChanges();
  }

  getUserCreatedJobById(id) {
    return this.usersCreatedJobsCollection.doc<Job>(id).valueChanges();
  }

  getJob(id) {
    return this.jobsCollection.doc<Job>(id).valueChanges();
  }

  updateJob(job: Job, id: string) {
    return this.jobsCollection.doc(id).update(job)
    .then(result => {
        this.presentToastWithOptions('Job updated successfully!', 'success')
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'error')
    });
  }

  addJob(job: Job) {
    this.jobsCollection.add({...job})
    .then(result => {
      this.usersCreatedJobsCollection.doc(result.id).set({id: result.id}).then(res => {
        this.presentToastWithOptions('Job created successfully!', 'success')
      });
    })
    .catch(error => {
      this.presentToastWithOptions('Something went wrong, please try again!', 'danger')
    });
  }

  deleteJob(id) {
   return this.jobsCollection.doc(id).delete().then(res => {
      this.usersCreatedJobsCollection.doc(id).delete().then(res => {
        this.presentToastWithOptions('Job deleted successfully!', 'success')
      });
    });
  }

  deleteFollowingJob(id) {
    return this.usersFollowedJobsCollection.doc(id).delete();
  }

  followAJob(id) {
    return this.jobsCollection.doc(id).update({ following: [this.currentUser] }).then(res => {
      return this.usersFollowedJobsCollection.doc(id).set({id});
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

