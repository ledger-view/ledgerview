import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashflowRow, DashboardSummary } from '@model/dashboard.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly apiUrl = environment.apiBaseUrl + '/api/dashboard';

  constructor(private http: HttpClient) {}

  getSummary$(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getCashflow$(weeks: number): Observable<CashflowRow[]> {
    return this.http.get<CashflowRow[]>(`${this.apiUrl}/cashflow`, {
      params: { weeks: String(weeks) }
    });
  }
}
