import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskActivitiesPage } from './task-activities.page';

const routes: Routes = [
  {
    path: '',
    component: TaskActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskActivitiesPageRoutingModule {}
