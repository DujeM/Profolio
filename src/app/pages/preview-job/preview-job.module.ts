import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewJobRoutingModule } from './preview-job-routing.module';

import { PreviewJobComponent } from './preview-job.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PreviewJobRoutingModule
  ],
  declarations: [PreviewJobComponent]
})
export class PreviewJobModule {}
