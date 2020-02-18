import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditProfolioPage } from './add-edit-profolio.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditProfolioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditProfolioPageRoutingModule {}
