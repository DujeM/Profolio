import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Profolio } from '../models/profolio';
import { ProfolioService } from '../services/profolio.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  profolioForm: FormGroup;
  profolio: Profolio = <Profolio>{};
  enteredLink: string;
  links = [];
  currentUser: any;
  constructor(
    private camera: Camera,
    private file: File,
    public actionSheetController: ActionSheetController,
    private profolioService: ProfolioService,
    private user: UserService,
    private formBuilder: FormBuilder,
  ) { }

  ionViewWillEnter() {
    this.getUserProfolio();
  }

  getUserProfolio() {
    this.profolioService.getProfolios()
    .subscribe(result => {
      if (result[0]) {
        this.profolio = result[0];
      }
    });

  }

  segmentChanged(segment: any) {
    console.log(segment)
  }
}
