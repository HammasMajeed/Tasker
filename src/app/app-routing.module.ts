import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },

  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then( m => m.TasksPageModule)
  },
  {
    path: 'task-activities',
    loadChildren: () => import('./task-activities/task-activities.module').then( m => m.TaskActivitiesPageModule)
  },
  {
    path: 'setting-up',
    loadChildren: () => import('./setting-up/setting-up.module').then( m => m.SettingUpPageModule)
  },
 
  {
    path: 'check-in-out',
    loadChildren: () => import('./check-in-out/check-in-out.module').then( m => m.CheckInOutPageModule)
  },
 
  {
    path: 'leaves',
    loadChildren: () => import('./leaves/leaves.module').then( m => m.LeavesPageModule)
  },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then( m => m.ExpensesPageModule)
  },
  {
    path: 'dashboard-patrol',
    loadChildren: () => import('./dashboard-patrol/dashboard-patrol.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'patrol',
    loadChildren: () => import('./patrol/patrol.module').then( m => m.PatrolPageModule)
  },
  {
    path: 'patrol-completed',
    loadChildren: () => import('./patrol-completed/patrol-completed.module').then( m => m.PatrolCompletedPageModule)
  },
  {
    path: 'instructions',
    loadChildren: () => import('./instructions/instructions.module').then( m => m.InstructionsPageModule)
  },
  {
    path: 'quick-patrol',
    loadChildren: () => import('./quick-patrol/quick-patrol.module').then( m => m.QuickPatrolPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
