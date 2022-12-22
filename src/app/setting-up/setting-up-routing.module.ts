import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingUpPage } from './setting-up.page';

const routes: Routes = [
  {
    path: '',
    component: SettingUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingUpPageRoutingModule {}
