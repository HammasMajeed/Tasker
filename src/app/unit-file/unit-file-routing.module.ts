import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitFilePage } from './unit-file.page';

const routes: Routes = [
  {
    path: '',
    component: UnitFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitFilePageRoutingModule {}
