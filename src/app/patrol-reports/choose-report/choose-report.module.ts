import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseReportPageRoutingModule } from './choose-report-routing.module';

import { ChooseReportPage } from './choose-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseReportPageRoutingModule
  ],
  declarations: [ChooseReportPage]
})
export class ChooseReportPageModule {}
