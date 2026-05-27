import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountModalComponent, AccountModalData } from '@features/accounts/components/account-modal/account-modal.component';
import { AccountService } from '@features/accounts/services/account.service';
import { Account, AccountRequest } from '@model/account.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AccountsComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  protected readonly accounts = this.accountService.accounts;
  protected readonly loading = this.accountService.loading;

  ngOnInit(): void {
    this.accountService.load();
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
      .open<AccountModalComponent, AccountModalData, { action: string; data?: AccountRequest }>(AccountModalComponent, {
        data: { account },
        width: '460px'
      })
      .afterClosed()
      .pipe(filter((r): r is { action: string; data?: AccountRequest } => !!r))
      .subscribe((result) => {
        if (result.action === 'save' && result.data) {
          const op$ = account ? this.accountService.update$(account.id, result.data) : this.accountService.create$(result.data);
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
