import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'
import {AppPath} from './app-routing.model';

const routes: Routes = [
  {
    path: AppPath.dashboard,
    loadChildren: () => import("@features/dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: '**',
    redirectTo: AppPath.dashboard
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
