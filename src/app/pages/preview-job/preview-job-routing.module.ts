import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewJobComponent } from './preview-job.component';

const routes: Routes = [
  {
    path: '',
    component: PreviewJobComponent
  },
  {
    path: ':id',
    component: PreviewJobComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewJobRoutingModule {}
