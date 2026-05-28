import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '@model/page.model';
import { Transaction, TransactionPageRequest } from '@model/transaction.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = '/api/transactions';

  constructor(private http: HttpClient) {}

  public getTransactions$(pageRequest?: TransactionPageRequest): Observable<Transaction[]> {
    return this.http.get<Page<Transaction>>(this.apiUrl, { params: pageRequest as any }).pipe(map((page) => page.content));
  }

  updateTransaction$(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  createTransaction$(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  deleteTransaction$(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${transactionId}`);
  }
}
