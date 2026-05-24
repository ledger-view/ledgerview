import { NgModule } from '@angular/core';
import { DashboardComponent } from '@features/dashboard/containers/dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { DashboardRoutingModule } from '@features/dashboard/dashboard-routing.module';
import { TransactionsTableComponent } from '@features/dashboard/components/transactions-table/transactions-table.component';

@NgModule({
  declarations: [
    DashboardComponent,
    TransactionsTableComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
