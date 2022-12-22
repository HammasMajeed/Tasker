import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingUpPageRoutingModule } from './setting-up-routing.module';

import { SettingUpPage } from './setting-up.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingUpPageRoutingModule
  ],
  declarations: [SettingUpPage]
})
export class SettingUpPageModule {}
