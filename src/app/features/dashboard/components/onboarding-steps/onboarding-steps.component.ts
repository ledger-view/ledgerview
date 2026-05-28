import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-onboarding-steps',
  templateUrl: './onboarding-steps.component.html',
  styleUrl: './onboarding-steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class OnboardingStepsComponent {
  @Output() addAccount = new EventEmitter<void>();
  @Output() reviewCategories = new EventEmitter<void>();
  @Output() importTransactions = new EventEmitter<void>();
  @Output() skip = new EventEmitter<void>();
}
