import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatrolPage } from './patrol.page';

const routes: Routes = [
  {
    path: '',
    component: PatrolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatrolPageRoutingModule {}
