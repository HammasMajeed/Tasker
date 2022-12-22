import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickPatrolPage } from './quick-patrol.page';

const routes: Routes = [
  {
    path: '',
    component: QuickPatrolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickPatrolPageRoutingModule {}
