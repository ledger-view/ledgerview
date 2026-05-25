import { NgModule } from '@angular/core';
import { DashboardComponent } from '@features/dashboard/containers/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@features/dashboard/dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}
