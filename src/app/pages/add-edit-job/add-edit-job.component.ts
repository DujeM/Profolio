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
  selector: 'app-add-edit-job',
  templateUrl: './add-edit-job.component.html',
  styleUrls: ['./add-edit-job.component.scss'],
})
export class AddEditJobComponent {

  jobForm: FormGroup;
  job: Job = <Job>{};
  enteredLink: string;
  links = [];
  currentUser: any;
  title = 'Edit your job';
  isEdit = true;
  jobId: string;

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
    this.jobForm = new FormGroup({
      name: new FormControl(),
      jobTitle: new FormControl(),
      description: new FormControl(),
      country: new FormControl(),
      city: new FormControl(),
      links: new FormControl()
   });
   this.jobId = route.snapshot.params.id;
  }

  ionViewWillEnter() {
    this.getUserJObs();
  }

  getUserJObs() {
    if (this.jobId) {
      this.jobService.getUserCreatedJobById(this.jobId)
      .subscribe(result => {
          this.jobForm = this.formBuilder.group({
            name: [result.name, Validators.required],
            jobTitle: [result.jobTitle, Validators.required],
            description: [result.description, Validators.required],
            country: [result.country, Validators.required],
            city: [result.city, Validators.required],
            links: ['', Validators.nullValidator]
          });
          this.links = result.links;
      }); 
    } else {
      this.isEdit = false;
      this.title = 'Create your job';
      this.jobForm = this.formBuilder.group({
        name: ['', Validators.required],
        jobTitle: ['', Validators.required],
        description: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        links: ['', Validators.nullValidator]
      });
    }
  }

  createJob() {
    this.job = this.jobForm.value;
    this.job.links = this.links;
    if (this.isEdit) {  
      this.jobService.updateJob(this.job, this.jobId);
    } else {
      this.jobService.addJob(this.job);
    }
    this.router.navigate(['/tabs/tab3']);
  }

  addNewLink() {
    this.links.push(this.jobForm.get('links').value);
    this.jobForm.get('links').setValue('');
  }

  removeLink(link: string) {
    const index = this.links.indexOf(link, 0);
    if (index > -1) {
      this.links.splice(index, 1);
    }
  }
}

