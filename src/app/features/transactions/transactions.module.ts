import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TransactionModalComponent } from './components/transaction-modal/transaction-modal.component';
import { TransactionsComponent } from './containers/transactions/transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import {LowerCasePipe} from "@angular/common";

@NgModule({
  declarations: [TransactionsComponent, TransactionModalComponent],
    imports: [SharedModule, TransactionsRoutingModule, LowerCasePipe]
})
export class TransactionsModule {}
