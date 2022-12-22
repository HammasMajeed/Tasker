import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatrolCompletedPage } from './patrol-completed.page';

const routes: Routes = [
  {
    path: '',
    component: PatrolCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatrolCompletedPageRoutingModule {}
