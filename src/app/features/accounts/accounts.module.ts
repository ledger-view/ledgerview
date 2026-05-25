import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountModalComponent } from './components/account-modal/account-modal.component';
import { AccountsComponent } from './containers/accounts/accounts.component';

@NgModule({
  declarations: [AccountsComponent, AccountModalComponent],
  imports: [SharedModule, AccountsRoutingModule]
})
export class AccountsModule {}
