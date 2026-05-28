import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IdentityClaims } from '@model/auth.model';
import { getLocalStorage, setLocalStorage } from '@shared/util/localStorage.utils';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';
import { UserModalComponent, UserModalResult } from '../user-modal.component';

const SIDENAV_KEY = 'lv_sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  host: { '[class.collapsed]': '!isOpened()' }
})
export class SidenavComponent {
  @Input() identityClaims: IdentityClaims | null = null;
  @Input() transactionsEnabled = false;
  @Input() transactionsTooltipKey = '';

  private readonly dialog = inject(MatDialog);
  private readonly oauthService = inject(OAuthService);

  protected readonly isOpened = signal<boolean>(getLocalStorage<boolean>(SIDENAV_KEY) ?? true);

  protected toggle(): void {
    const next = !this.isOpened();
    this.isOpened.set(next);
    setLocalStorage(SIDENAV_KEY, next);
  }

  protected openUserModal(): void {
    if (!this.identityClaims) return;
    this.dialog
      .open<UserModalComponent, IdentityClaims, UserModalResult>(UserModalComponent, {
        data: this.identityClaims,
        width: '360px'
      })
      .afterClosed()
      .pipe(filter((r): r is 'logout' => r === 'logout'))
      .subscribe(() => this.oauthService.logOut());
  }
}
