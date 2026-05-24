import { NgModule } from '@angular/core';
import { TransactionsTableComponent } from '@features/dashboard/components/transactions-table/transactions-table.component';
import { DashboardComponent } from '@features/dashboard/containers/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@features/dashboard/dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, TransactionsTableComponent],
  imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}
