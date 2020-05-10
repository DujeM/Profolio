import { Component, OnInit, OnDestroy } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Profolio } from '../models/profolio';
import { ProfolioService } from '../services/profolio.service';
import { JobService } from '../services/job.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Job } from '../models/job';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  profolioForm: FormGroup;
  profolio: Profolio = <Profolio>{};
  createdJobs: any[] = [];
  followingJobs: any[] = [];
  followingJobsIds: any[] = [];
  enteredLink: string;
  links = [];
  currentUser: any;
  userHasProfolio: boolean = false;
  userHasCreatedJobs: boolean = false;
  userHasFollowingJobs: boolean = false;
  loading: boolean = true;
  selectedSegment: string = 'profolio';
  userCreatedJobsIds: any[] = [];
  userFollowingJobsIds: any[] = [];

  constructor(
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
    private profolioService: ProfolioService,
    private jobService: JobService,
    private user: UserService,
    private formBuilder: FormBuilder,
  ) {
   }

  ionViewWillEnter() {
    this.selectedSegment = 'profolio';
    this.segmentChanged('profolio');
  }

  getUserJobs() {
    this.loading = true;

    this.jobService.getUserCreatedJobs()
    .subscribe((result: any[]) => {
      this.createdJobs = [];
      this.userHasCreatedJobs = false;

      this.userCreatedJobsIds = result;
      this.initUserCreatedJobsData();
    });
  }

  initUserCreatedJobsData() {
    this.userCreatedJobsIds.forEach(job => {
      this.jobService.getJob(job.id).subscribe(res => {
        this.createdJobs.push({id: job.id, ...res});
        this.userHasCreatedJobs = true;
      });
    });
    this.getUserFollowingJobs();
  }

  getUserFollowingJobs() {
    this.jobService.getUserFollowingJobs().subscribe(result => {
      this.followingJobs = [];
      this.userHasFollowingJobs = false;

      this.userFollowingJobsIds = result;
      this.initUserFolowingJobsData();
    });
  }

  initUserFolowingJobsData() {
    this.userFollowingJobsIds.forEach(job => {
      this.jobService.getJob(job.id).subscribe(res => {
        this.followingJobs.push({id: job.id, ...res});
        this.userHasFollowingJobs = true;
      });
    });
    setTimeout(() => {
      this.loading = false;
    },500);}

  getUserProfolio() {
    this.profolioService.getProfolio(this.user.getUID())
    .subscribe(result => {
      if (result) {
        this.profolio = result;
        this.userHasProfolio = true;
      }
      setTimeout(() => {
        this.loading = false;
      },500);});
  }

  segmentChanged(segment: string) {
    this.selectedSegment = segment;
    if (this.selectedSegment == 'jobs') {
      this.loading = true;
      this.getUserJobs();
    } else {
      this.loading = true;
      this.getUserProfolio();
    }
  }

  deleteJob(job: Job) {
    this.loading = true;
    let isCurrentUserFollowingThisJob = false;

    this.jobService.deleteJob(job.id).then(res => {
      this.followingJobs.filter(followingJob => {
        if (followingJob.id == job.id) {
          isCurrentUserFollowingThisJob = true;
        } 
      });
      isCurrentUserFollowingThisJob ? this.deleteFollowingJob(job) : this.getUserJobs();
    });
  }
  
  deleteFollowingJob(job: Job) {
    this.loading = true;
    job.following = job.following.filter(id => id !== this.currentUser);

    this.jobService.updateJob(job, job.id).then(res => {
      this.jobService.deleteFollowingJob(job.id).then(res => {
        this.getUserJobs();
      });
    });
  }
}
