import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { UnitFilePageRoutingModule } from './unit-file-routing.module';

import { UnitFilePage } from './unit-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    UnitFilePageRoutingModule
  ],
  declarations: [UnitFilePage,IonicSelectableComponent]
})
export class UnitFilePageModule {}
