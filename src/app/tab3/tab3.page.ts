import { Component, OnInit } from '@angular/core';
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
export class Tab3Page implements OnInit{

  profolioForm: FormGroup;
  profolio: Profolio = <Profolio>{};
  createdJobs: any[] = [];
  enteredLink: string;
  links = [];
  currentUser: any;
  userHasProfolio: boolean = false;
  userHasCreatedJobs: boolean = false;
  loading: boolean = true;
  selectedSegment: string = 'profolio';
  constructor(
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
    private profolioService: ProfolioService,
    private jobService: JobService,
    private user: UserService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.getUserProfolio();
  }
  getUserJobs() {
    this.jobService.getUserCreatedJobs()
    .subscribe(result => {
      if (result) {
        this.createdJobs = result;
        console.log(this.createdJobs)
        this.userHasCreatedJobs = true;
      }
      this.loading = false;
    });
  }

  getUserProfolio() {
    this.profolioService.getProfolio()
    .subscribe(result => {
      if (result) {
        this.profolio = result;
        console.log(this.profolio)
        this.userHasProfolio = true;
      }
      this.loading = false;
    });
  }

  segmentChanged(segment: string) {
    this.selectedSegment = segment;
    if (this.selectedSegment == 'jobs') {
      this.loading = true;
      this.getUserJobs();
    }
  }

  deleteJob(id) {
    this.jobService.deleteJob(id);
  }
}
