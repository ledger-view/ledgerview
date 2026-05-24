import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  finalize,
  MonoTypeOperatorFunction,
  Observable,
} from 'rxjs';
import { TransactionsService } from '../../../../services/transactions.service';
import { Transaction } from '@model/transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class DashboardComponent implements OnInit {
  protected loading$ = new BehaviorSubject<boolean>(true);
  private transactions = new BehaviorSubject<Transaction[]>([]);
  protected transactions$: Observable<Transaction[]> =
    this.transactions.asObservable();

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.transactionsService
      .getTransactions$()
      .pipe(this.trackLoading())
      .subscribe((transactions) => this.transactions.next(transactions));
  }

  private trackLoading<T>(): MonoTypeOperatorFunction<T> {
    return (source$) => {
      this.loading$.next(true);
      return source$.pipe(finalize(() => this.loading$.next(false)));
    };
  }
}
