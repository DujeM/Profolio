import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditProfolioPageRoutingModule } from './add-edit-profolio-routing.module';

import { AddEditProfolioPage } from './add-edit-profolio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddEditProfolioPageRoutingModule
  ],
  declarations: [AddEditProfolioPage]
})
export class AddEditProfolioPageModule {}
