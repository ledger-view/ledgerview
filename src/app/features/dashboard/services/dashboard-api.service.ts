import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '@model/account.model';
import { DashboardSummary, ExpenseByCategory } from '@model/dashboard.model';
import { Page } from '@model/page.model';
import { Transaction } from '@model/transaction.model';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getSummary$(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.base}/api/dashboard/summary`);
  }

  getExpensesByCategory$(year?: number, month?: number): Observable<ExpenseByCategory[]> {
    const params: Record<string, string> = {};
    if (year != null) params['year'] = String(year);
    if (month != null) params['month'] = String(month);
    return this.http.get<ExpenseByCategory[]>(`${this.base}/api/dashboard/expenses-by-category`, { params });
  }

  getRecentTransactions$(): Observable<Transaction[]> {
    return this.http
      .get<Page<Transaction>>(`${this.base}/api/transactions`, {
        params: { sort: 'date', dir: 'desc', size: '8', page: '0' }
      })
      .pipe(map((p) => p.content));
  }

  getAccounts$(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.base}/api/accounts`);
  }
}
