import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { IncidentReportPageRoutingModule } from './incident-report-routing.module';

import { IncidentReportPage } from './incident-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicSelectableModule,
    IonicModule,
    IncidentReportPageRoutingModule
  ],
  declarations: [IncidentReportPage]
})
export class IncidentReportPageModule {}
