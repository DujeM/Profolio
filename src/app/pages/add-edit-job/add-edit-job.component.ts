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
  currencies: any;
  countries: any;
  selectedCountry: any;

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
      links: new FormControl(),
      salary: new FormControl(),
      currency: new FormControl(),
      type: new FormControl(),
      isRemote: new FormControl()
   });
   this.jobId = route.snapshot.params.id;
  }

  ionViewWillEnter() {
    this.getUserJObs();
    this.getAllCountries();
    this.getAllCurrencies();
  }

  getAllCountries() {
    this.user.getAllCountries().subscribe(result => {
      this.countries = result;
    });
  }

  getAllCurrencies() {
    this.user.getAllCurrencies().subscribe(result => {
      this.currencies = result;
    });
  }

  getUserJObs() {
    if (this.jobId) {
      this.jobService.getJob(this.jobId)
      .subscribe(result => {
          this.jobForm = this.formBuilder.group({
            name: [result.name, Validators.required],
            jobTitle: [result.jobTitle, Validators.required],
            description: [result.description, Validators.required],
            country: [result.country, Validators.required],
            city: [result.city, Validators.required],
            links: ['', Validators.nullValidator],
            salary: [result.salary, Validators.required],
            type: [result.type, Validators.required],
            currency: [result.currency, Validators.required],
            isRemote: [result.isRemote, Validators.required]
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
        salary: ['', Validators.required],
        currency: ['', Validators.required],
        type: ['', Validators.required],
        links: ['', Validators.nullValidator],
        isRemote: [false, Validators.required]
      });
    }
  }

  selectCountry(event: any) {
    this.selectedCountry = event;
    this.selectCurrency(this.selectedCountry.currencies[0].code);
  }

  selectCurrency(event: any) {
    this.jobForm.controls['currency'].setValue(event);
    console.log(this.jobForm)
  }

  createJob() {
    this.job = this.jobForm.value;
    this.job.links = this.links;
    this.job.country = this.selectedCountry.name;
    this.job.following = [];
    this.job.views = 0;
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

