import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatrolPageRoutingModule } from './patrol-routing.module';

import { PatrolPage } from './patrol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatrolPageRoutingModule
  ],
  declarations: [PatrolPage]
})
export class PatrolPageModule {}
