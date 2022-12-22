import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskActivitiesPageRoutingModule } from './task-activities-routing.module';

import { TaskActivitiesPage } from './task-activities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskActivitiesPageRoutingModule
  ],
  declarations: [TaskActivitiesPage]
})
export class TaskActivitiesPageModule {}
