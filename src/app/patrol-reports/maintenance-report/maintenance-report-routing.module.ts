import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceReportPage } from './maintenance-report.page';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceReportPageRoutingModule {}
