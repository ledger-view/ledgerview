import { Injectable, signal } from '@angular/core';
import { Account, AccountRequest } from '@model/account.model';
import { finalize, tap } from 'rxjs';
import { AccountApiService } from './account-api.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _accounts = signal<Account[]>([]);
  private _loading = signal(false);

  readonly accounts = this._accounts.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(private api: AccountApiService) {}

  load(): void {
    this._loading.set(true);
    this.api.getAccounts$().subscribe({
      next: (a) => {
        this._accounts.set(a);
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }

  create$(data: AccountRequest) {
    return this.api.createAccount$(data).pipe(
      tap((created) => this._accounts.update((list) => [...list, created])),
      finalize(() => {})
    );
  }

  update$(id: string, data: AccountRequest) {
    return this.api
      .updateAccount$(id, data)
      .pipe(tap((updated) => this._accounts.update((list) => list.map((a) => (a.id === id ? updated : a)))));
  }

  delete$(id: string) {
    return this.api.deleteAccount$(id).pipe(tap(() => this._accounts.update((list) => list.filter((a) => a.id !== id))));
  }
}
