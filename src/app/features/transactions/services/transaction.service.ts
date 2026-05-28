import { Injectable, signal } from '@angular/core';
import { Transaction, TransactionPageRequest, TransactionRequest } from '@model/transaction.model';
import { finalize } from 'rxjs';
import { TransactionApiService } from './transaction-api.service';

export interface TransactionPage {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private _page = signal<TransactionPage>({ content: [], totalElements: 0, totalPages: 1, number: 0, size: 12 });
  private _loading = signal(false);

  readonly page = this._page.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(private api: TransactionApiService) {}

  load(params?: TransactionPageRequest): void {
    this._loading.set(true);
    this.api.getTransactions$(params).subscribe({
      next: (p) => {
        this._page.set(p);
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }

  create$(data: TransactionRequest) {
    this._loading.set(true);
    return this.api.createTransaction$(data).pipe(finalize(() => this._loading.set(false)));
  }

  update$(id: string, data: TransactionRequest) {
    this._loading.set(true);
    return this.api.updateTransaction$(id, data).pipe(finalize(() => this._loading.set(false)));
  }

  delete$(id: string) {
    this._loading.set(true);
    return this.api.deleteTransaction$(id).pipe(finalize(() => this._loading.set(false)));
  }
}
