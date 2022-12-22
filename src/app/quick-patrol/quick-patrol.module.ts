import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickPatrolPageRoutingModule } from './quick-patrol-routing.module';

import { QuickPatrolPage } from './quick-patrol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuickPatrolPageRoutingModule
  ],
  declarations: [QuickPatrolPage]
})
export class QuickPatrolPageModule {}
