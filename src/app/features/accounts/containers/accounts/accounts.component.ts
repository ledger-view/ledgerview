import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccountModalComponent,
  AccountModalData,
  AccountModalResult
} from '@features/accounts/components/account-modal/account-modal.component';
import { AccountService } from '@features/accounts/services/account.service';
import { CurrencyService } from '@features/accounts/services/currency.service';
import { Account, AccountCreateRequest, AccountUpdateRequest } from '@model/account.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AccountsComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly currencyService = inject(CurrencyService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  protected readonly accounts = this.accountService.accounts;
  protected readonly loading = this.accountService.loading;

  ngOnInit(): void {
    this.accountService.load();
    const editId = this.route.snapshot.queryParamMap.get('editId');
    if (editId) {
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
      toObservable(this.accountService.loaded, { injector: this.injector })
        .pipe(
          filter((loaded) => loaded),
          take(1)
        )
        .subscribe(() => {
          const acc = this.accountService.accounts().find((a) => a.id === editId);
          if (acc) this.openModal(acc);
        });
    }
  }

  protected get total(): number {
    return this.accounts().reduce((s, a) => s + a.balance, 0);
  }

  protected accountColor(type: string): string {
    const m: Record<string, string> = { Checking: '#4F46E5', Savings: '#16A34A', Cash: '#94A3B8', Crypto: '#F59E0B' };
    return m[type] ?? '#4F46E5';
  }

  protected accountIcon(type: string): string {
    const m: Record<string, string> = {
      Checking: 'credit_card',
      Savings: 'account_balance',
      Cash: 'wallet',
      Crypto: 'currency_bitcoin'
    };
    return m[type] ?? 'credit_card';
  }

  protected fmtMoney(amount: number): string {
    return Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  protected openAdd(): void {
    this.openModal(undefined);
  }

  protected openEdit(account: Account): void {
    this.openModal(account);
  }

  protected openDelete(account: Account): void {
    this.openConfirmDelete(account);
  }

  private openConfirmDelete(account: Account): void {
    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
        data: {
          title: this.translate.instant('accounts.confirmDelete.title'),
          message: this.translate.instant('accounts.confirmDelete.message', { name: account.name }),
          danger: true
        },
        width: '380px'
      })
      .afterClosed()
      .pipe(
        filter((confirmed): confirmed is true => confirmed === true),
        switchMap(() => this.accountService.delete$(account.id))
      )
      .subscribe();
  }

  private openModal(account?: Account): void {
    this.dialog
      .open<AccountModalComponent, AccountModalData, AccountModalResult>(AccountModalComponent, {
        data: { account, currencies: [...this.currencyService.fiat(), ...this.currencyService.crypto()] },
        width: '460px'
      })
      .afterClosed()
      .pipe(filter((r): r is AccountModalResult => !!r))
      .subscribe((result) => {
        if (result.action === 'save') {
          const op$ = account
            ? this.accountService.update$(account.id, result.data as AccountUpdateRequest)
            : this.accountService.create$(result.data as AccountCreateRequest);
          op$.subscribe();
        }
        if (result.action === 'delete' && account) {
          this.openConfirmDelete(account);
        }
      });
  }

  protected trackById(_: number, item: Account): string {
    return item.id;
  }
}
