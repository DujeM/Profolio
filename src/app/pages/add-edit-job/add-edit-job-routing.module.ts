import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditJobComponent } from './add-edit-job.component';

const routes: Routes = [
  {
    path: '',
    component: AddEditJobComponent
  },
  {
    path: ':id',
    component: AddEditJobComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditJobPageRoutingModule {}
