import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AccountApiService } from '@features/accounts/services/account-api.service';
import { CategoryApiService } from '@features/categories/services/category-api.service';
import { forkJoin, map, Observable } from 'rxjs';
import { AppPath } from '../app-routing.model';

@Injectable({ providedIn: 'root' })
export class TransactionsPrerequisitesGuard implements CanActivate {
  constructor(
    private accountApi: AccountApiService,
    private categoryApi: CategoryApiService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return forkJoin({
      accounts: this.accountApi.getAccounts$(),
      categories: this.categoryApi.getCategories$()
    }).pipe(
      map(({ accounts, categories }) => {
        if (accounts.length === 0) return this.router.createUrlTree(['/', AppPath.accounts]);
        if (categories.length === 0) return this.router.createUrlTree(['/', AppPath.categories]);
        return true;
      })
    );
  }
}
