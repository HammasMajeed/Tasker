import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatrolCompletedPageRoutingModule } from './patrol-completed-routing.module';

import { PatrolCompletedPage } from './patrol-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatrolCompletedPageRoutingModule
  ],
  declarations: [PatrolCompletedPage]
})
export class PatrolCompletedPageModule {}
