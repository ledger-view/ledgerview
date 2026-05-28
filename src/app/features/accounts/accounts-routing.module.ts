import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './containers/accounts/accounts.component';
import { currenciesResolver } from './currency.resolver';

const routes: Routes = [{ path: '', component: AccountsComponent, resolve: { currencies: currenciesResolver } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}
