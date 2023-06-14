import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnpublishedReportsPageRoutingModule } from './unpublished-reports-routing.module';

import { UnpublishedReportsPage } from './unpublished-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnpublishedReportsPageRoutingModule
  ],
  declarations: [UnpublishedReportsPage]
})
export class UnpublishedReportsPageModule {}
