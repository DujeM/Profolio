import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditJobPageRoutingModule } from './add-edit-job-routing.module';

import { AddEditJobComponent } from './add-edit-job.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddEditJobPageRoutingModule
  ],
  declarations: [AddEditJobComponent]
})
export class AddEditJobPageModule {}
