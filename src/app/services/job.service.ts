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

  constructor(
    private db: AngularFirestore,
    private user: UserService,
    public toastController: ToastController,
    private auth: AngularFireAuth
  ) { 
    this.jobsCollection = this.db.collection('jobs');
    this.usersCreatedJobsCollection = this.db.collection('users').doc(this.user.getUID()).collection('created_jobs');
    this.usersFollowedJobsCollection = this.db.collection('users').doc(this.user.getUID()).collection('following_jobs');
  }

  getUserCreatedJobs() {
    this.usersCreatedJobsCollection = this.db.collection('users').doc(this.user.getUID()).collection('created_jobs');
    return this.usersCreatedJobsCollection.valueChanges();
  }

  getUserFollowingJobs() {
    this.usersFollowedJobsCollection = this.db.collection('users').doc(this.user.getUID()).collection('following_jobs');
    return this.usersFollowedJobsCollection.valueChanges();
  }

  getUserCreatedJobById(id) {
    this.usersCreatedJobsCollection = this.db.collection('users').doc(this.user.getUID()).collection('created_jobs');
    return this.usersCreatedJobsCollection.doc<Job>(id).valueChanges();
  }

  getJob(id) {
    return this.jobsCollection.doc<Job>(id).valueChanges();
  }

  updateJob(job: Job, id: string) {
    return this.jobsCollection.doc(id).update(job);
  }

  getNewJobsForExploreTab() {
    return this.jobsCollection.ref.orderBy("created_at", 'desc').limit(3).get();
  }

  getPopularJobsForExploreTab() {
    return this.jobsCollection.ref.orderBy("views", 'desc').limit(3).get();
  }

  incrementJobViews(id) {
    let job: any;
    this.jobsCollection.doc<Job>(id).get().subscribe(res => {
      job = res.data();
      job.views += 1;
      this.updateJob(job, id);
    })
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
    return this.jobsCollection.doc(id).update({ following: [this.user.getUID()] }).then(res => {
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

