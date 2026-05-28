import { NgModule } from '@angular/core';
import { OnboardingStepsComponent } from '@features/dashboard/components/onboarding-steps/onboarding-steps.component';
import { DashboardComponent } from '@features/dashboard/containers/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@features/dashboard/dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, OnboardingStepsComponent],
  imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}
