import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '@features/accounts/services/account.service';
import { CategoryService } from '@features/categories/services/category.service';
import {
  TransactionModalComponent,
  TransactionModalData
} from '@features/transactions/components/transaction-modal/transaction-modal.component';
import { TransactionService } from '@features/transactions/services/transaction.service';
import { Account } from '@model/account.model';
import { Category } from '@model/category.model';
import { TransactionRequest } from '@model/transaction.model';
import { filter, switchMap } from 'rxjs';

export interface TxFilters {
  type: 'all' | 'INCOME' | 'EXPENSE';
  accountId: string;
  categoryId: string;
  range: '7d' | '30d' | '90d' | 'ytd';
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TransactionsComponent implements OnInit {
  private readonly txService = inject(TransactionService);
  private readonly accountService = inject(AccountService);
  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);

  protected readonly page = this.txService.page;
  protected readonly loading = this.txService.loading;
  protected readonly accounts = this.accountService.accounts;
  protected readonly categories = this.categoryService.categories;

  protected readonly filters = signal<TxFilters>({ type: 'all', accountId: '', categoryId: '', range: '30d' });
  protected readonly sort = signal<{ key: 'date' | 'amount' | 'title'; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' });
  protected readonly currentPage = signal(0);
  protected readonly pageSize = 12;

  protected readonly accountMap = computed<Record<string, Account>>(() =>
    Object.fromEntries(this.accounts().map((a) => [a.id, a]))
  );

  protected readonly categoryMap = computed<Record<string, Category>>(() =>
    Object.fromEntries(this.categories().map((c) => [c.id, c]))
  );

  ngOnInit(): void {
    if (this.accountService.accounts().length === 0) this.accountService.load();
    if (this.categoryService.categories().length === 0) this.categoryService.load();
    this.loadTransactions();
  }

  private loadTransactions(): void {
    const f = this.filters();
    const s = this.sort();
    const params: Record<string, string | number> = {
      page: this.currentPage(),
      size: this.pageSize,
      sort: s.key,
      dir: s.dir,
      ...this.dateRangeParams(f.range)
    };
    if (f.type !== 'all') params['type'] = f.type;
    if (f.accountId) params['accountId'] = f.accountId;
    if (f.categoryId) params['categoryId'] = f.categoryId;

    this.txService.load(params as any);
  }

  private dateRangeParams(range: TxFilters['range']): Record<string, string> {
    const today = new Date();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const dateTo = fmt(today);

    if (range === '7d') {
      const from = new Date(today);
      from.setDate(from.getDate() - 7);
      return { dateFrom: fmt(from), dateTo };
    }
    if (range === '30d') {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { dateFrom: fmt(from), dateTo };
    }
    if (range === '90d') {
      const from = new Date(today);
      from.setDate(from.getDate() - 90);
      return { dateFrom: fmt(from), dateTo };
    }
    return { dateFrom: `${today.getFullYear()}-01-01`, dateTo };
  }

  protected setTypeFilter(type: TxFilters['type']): void {
    this.filters.update((f) => ({ ...f, type }));
    this.currentPage.set(0);
    this.loadTransactions();
  }

  protected setAccountFilter(id: string): void {
    this.filters.update((f) => ({ ...f, accountId: id }));
    this.currentPage.set(0);
    this.loadTransactions();
  }

  protected setCategoryFilter(id: string): void {
    this.filters.update((f) => ({ ...f, categoryId: id }));
    this.currentPage.set(0);
    this.loadTransactions();
  }

  protected setRangeFilter(range: TxFilters['range']): void {
    this.filters.update((f) => ({ ...f, range }));
    this.currentPage.set(0);
    this.loadTransactions();
  }

  protected toggleSort(key: 'date' | 'amount' | 'title'): void {
    const cur = this.sort();
    this.sort.set({ key, dir: cur.key === key && cur.dir === 'desc' ? 'asc' : 'desc' });
    this.loadTransactions();
  }

  protected prevPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      this.loadTransactions();
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.page().totalPages - 1) {
      this.currentPage.update((p) => p + 1);
      this.loadTransactions();
    }
  }

  protected openAdd(): void {
    this.dialog
      .open<TransactionModalComponent, TransactionModalData, TransactionRequest>(TransactionModalComponent, {
        data: { accounts: this.accounts(), categories: this.categories() },
        width: '500px'
      })
      .afterClosed()
      .pipe(
        filter((r): r is TransactionRequest => !!r),
        switchMap((req) => this.txService.create$(req))
      )
      .subscribe(() => this.loadTransactions());
  }

  protected fmtMoney(amount: number, currency = 'USD'): string {
    const sym: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
    return (
      (sym[currency] ?? '$') + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  }

  protected fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  protected showingFrom(): number {
    const p = this.page();
    return p.totalElements === 0 ? 0 : p.number * p.size + 1;
  }

  protected showingTo(): number {
    const p = this.page();
    return Math.min(p.totalElements, (p.number + 1) * p.size);
  }

  protected trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
