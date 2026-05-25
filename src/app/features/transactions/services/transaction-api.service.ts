import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '@model/page.model';
import { Transaction, TransactionPageRequest, TransactionRequest } from '@model/transaction.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions$(params?: TransactionPageRequest): Observable<Page<Transaction>> {
    return this.http.get<Page<Transaction>>(this.baseUrl, { params: params as any });
  }

  createTransaction$(data: TransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, data);
  }

  updateTransaction$(id: string, data: TransactionRequest): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, data);
  }

  deleteTransaction$(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
