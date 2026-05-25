import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TransactionModalComponent } from './components/transaction-modal/transaction-modal.component';
import { TransactionsComponent } from './containers/transactions/transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';

@NgModule({
  declarations: [TransactionsComponent, TransactionModalComponent],
  imports: [SharedModule, TransactionsRoutingModule]
})
export class TransactionsModule {}
