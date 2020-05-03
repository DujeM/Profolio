import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preview-job',
  templateUrl: './preview-job.component.html',
  styleUrls: ['./preview-job.component.scss'],
})
export class PreviewJobComponent implements OnInit {

  job: Job = <Job>{};
  currentUser: any;
  isEdit = true;
  jobId: string;
  currentUserIsFollowingThisJob: boolean = false;

  constructor(
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
    private jobService: JobService,
    private user: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.user.getUID();
    this.jobId = route.snapshot.params.id;
    this.jobService.incrementJobViews(this.jobId);
  }

  ngOnInit() {
    this.getUserJObs();
  }

  getUserJObs() {
    this.jobService.getJob(this.jobId)
      .subscribe(result => {
        this.job = result;
        if (this.job) {
          this.job.following.forEach(id => {
            if (this.currentUser == id) {
              this.currentUserIsFollowingThisJob = true;
            }
          });
        }
      });
  }

  followAJob() {
    this.jobService.followAJob(this.jobId).then(res => {
      this.currentUserIsFollowingThisJob = true;
    });
  }

  ungfollowAJob() {
    this.currentUserIsFollowingThisJob = false;
    this.job.following = this.job.following.filter(id => id !== this.currentUser);
    this.jobService.updateJob(this.job, this.jobId).then(res => {
      this.jobService.deleteFollowingJob(this.jobId);
    })
  }
}

