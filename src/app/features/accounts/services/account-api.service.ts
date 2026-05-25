import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, AccountRequest } from '@model/account.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts$(): Observable<Account[]> {
    return this.http.get<Account[]>(this.baseUrl);
  }

  createAccount$(data: AccountRequest): Observable<Account> {
    return this.http.post<Account>(this.baseUrl, data);
  }

  updateAccount$(id: string, data: AccountRequest): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${id}`, data);
  }

  deleteAccount$(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
