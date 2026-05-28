import { Injectable, signal } from '@angular/core';
import { Account, AccountCreateRequest, AccountUpdateRequest } from '@model/account.model';
import { finalize, tap } from 'rxjs/operators';
import { AccountApiService } from './account-api.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _accounts = signal<Account[]>([]);
  private _loading = signal(false);
  private _loaded = signal(false);

  readonly accounts = this._accounts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  constructor(private api: AccountApiService) {}

  load(): void {
    this._loading.set(true);
    this.api.getAccounts$().subscribe({
      next: (a) => {
        this._accounts.set(a);
        this._loading.set(false);
        this._loaded.set(true);
      },
      error: () => {
        this._loading.set(false);
        this._loaded.set(true);
      }
    });
  }

  create$(data: AccountCreateRequest) {
    this._loading.set(true);
    return this.api.createAccount$(data).pipe(
      tap((created) => this._accounts.update((list) => [...list, created])),
      finalize(() => this._loading.set(false))
    );
  }

  update$(id: string, data: AccountUpdateRequest) {
    this._loading.set(true);
    return this.api.updateAccount$(id, data).pipe(
      tap((updated) => this._accounts.update((list) => list.map((a) => (a.id === id ? updated : a)))),
      finalize(() => this._loading.set(false))
    );
  }

  delete$(id: string) {
    this._loading.set(true);
    return this.api.deleteAccount$(id).pipe(
      tap(() => this._accounts.update((list) => list.filter((a) => a.id !== id))),
      finalize(() => this._loading.set(false))
    );
  }
}
