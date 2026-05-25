import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from './app-routing.model';

const routes: Routes = [
  {
    path: AppPath.dashboard,
    loadChildren: () => import('@features/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: AppPath.transactions,
    loadChildren: () => import('@features/transactions/transactions.module').then((m) => m.TransactionsModule)
  },
  {
    path: AppPath.accounts,
    loadChildren: () => import('@features/accounts/accounts.module').then((m) => m.AccountsModule)
  },
  {
    path: AppPath.categories,
    loadChildren: () => import('@features/categories/categories.module').then((m) => m.CategoriesModule)
  },
  {
    path: '**',
    redirectTo: AppPath.dashboard
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
