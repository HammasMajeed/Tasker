import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnpublishedReportsPage } from './unpublished-reports.page';

const routes: Routes = [
  {
    path: '',
    component: UnpublishedReportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnpublishedReportsPageRoutingModule {}
