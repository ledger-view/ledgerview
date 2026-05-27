import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '@model/account.model';
import { DashboardSummary } from '@model/dashboard.model';
import { Page } from '@model/page.model';
import { Transaction } from '@model/transaction.model';
import { dayEndIso, dayStartIso } from '@shared/date/utils';
import { environment } from 'environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getSummary$(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.base}/api/dashboard/summary`);
  }

  getAccounts$(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.base}/api/accounts`);
  }

  getCashflowTransactions$(days: number): Observable<Transaction[]> {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    return this.http
      .get<Page<Transaction>>(`${this.base}/api/transactions`, {
        params: { sort: 'date', dir: 'asc', size: '1000', page: '0', dateFrom: dayStartIso(from), dateTo: dayEndIso(now) }
      })
      .pipe(map((p) => p.content));
  }
}
