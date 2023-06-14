import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseReportPage } from './choose-report.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseReportPageRoutingModule {}
