import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenanceReportPageRoutingModule } from './maintenance-report-routing.module';

import { MaintenanceReportPage } from './maintenance-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenanceReportPageRoutingModule
  ],
  declarations: [MaintenanceReportPage]
})
export class MaintenanceReportPageModule {}
