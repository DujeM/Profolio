import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Profolio } from '../../models/profolio';
import { ProfolioService } from '../../services/profolio.service';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-profolio',
  templateUrl: './add-edit-profolio.page.html',
  styleUrls: ['./add-edit-profolio.page.scss'],
})
export class AddEditProfolioPage {

  profolioForm: FormGroup;
  profolio: Profolio = <Profolio>{};
  enteredLink: string;
  links = [];
  currentUser: any;
  title = 'Edit your profolio';
  isEdit = true;
  profolioId: string;
  countries: any;

  constructor(
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
    private profolioService: ProfolioService,
    private user: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.currentUser = this.user.getUID();
    this.profolioForm = new FormGroup({
      name: new FormControl(),
      jobTitle: new FormControl(),
      description: new FormControl(),
      country: new FormControl(),
      city: new FormControl(),
      links: new FormControl()
   });
  }

  ionViewWillEnter() {
    this.getUserProfolio();
    this.getAllCountries();
  }

  getAllCountries() {
    this.user.getAllCountries().subscribe(result => {
      this.countries = result;
    });
  }

  getUserProfolio() {
    this.profolioService.getProfolio()
    .subscribe(result => {
      if (result) {
        this.profolioForm = this.formBuilder.group({
          name: [result.name, Validators.required],
          jobTitle: [result.jobTitle, Validators.required],
          description: [result.description, Validators.required],
          country: [result.country, Validators.required],
          city: [result.city, Validators.required],
          links: ['', Validators.nullValidator]
        });
        this.links = result.links;      
        this.profolioId = result.id;
      } else {
        this.isEdit = false;
        this.title = 'Create your profolio';
        this.profolioForm = this.formBuilder.group({
          name: ['', Validators.required],
          jobTitle: ['', Validators.required],
          description: ['', Validators.required],
          country: ['', Validators.required],
          city: ['', Validators.required],
          links: ['', Validators.nullValidator]
        });
      }      
    });

  }

  createProfolio() {
    this.profolio = this.profolioForm.value;
    this.profolio.links = this.links;
    if (this.isEdit) {  
      this.profolioService.updateProfolio(this.profolio, this.profolioId);
    } else {
      this.profolioService.addProfolio(this.profolio);
    }
    this.router.navigate(['/tabs/tab3']);
  }

  addNewLink() {
    this.links.push(this.profolioForm.get('links').value);
    this.profolioForm.get('links').setValue('');
  }

  removeLink(link: string) {
    const index = this.links.indexOf(link, 0);
    if (index > -1) {
      this.links.splice(index, 1);
    }
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
}

