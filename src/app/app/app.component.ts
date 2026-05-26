import { ChangeDetectionStrategy, Component, computed, OnInit } from '@angular/core';
import { AccountService } from '@features/accounts/services/account.service';
import { CategoryService } from '@features/categories/services/category.service';
import { IdentityClaims } from '@model/auth.model';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class AppComponent implements OnInit {
  protected readonly transactionsEnabled = computed(
    () => this.accountService.accounts().length > 0 && this.categoryService.categories().length > 0
  );

  protected readonly transactionsTooltipKey = computed(() => {
    if (!this.accountService.loaded() || !this.categoryService.loaded()) return '';
    const noAccounts = this.accountService.accounts().length === 0;
    const noCategories = this.categoryService.categories().length === 0;
    if (noAccounts && noCategories) return 'nav.transactionsNeedBoth';
    if (noAccounts) return 'nav.transactionsNeedAccount';
    return 'nav.transactionsNeedCategory';
  });

  constructor(
    private translateService: TranslateService,
    private oauthService: OAuthService,
    private accountService: AccountService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.translateService.setFallbackLang('en');
    this.translateService.use('en');
    this.accountService.load();
    this.categoryService.load();
  }

  protected get isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  protected logout(): void {
    this.oauthService.logOut();
  }

  protected get identityClaims(): IdentityClaims | null {
    return (this.oauthService.getIdentityClaims() as IdentityClaims) ?? null;
  }

  protected get userInitials(): string {
    const c = this.identityClaims;
    if (!c) return '?';
    if (c.given_name && c.family_name) return (c.given_name[0] + c.family_name[0]).toUpperCase();
    if (c.name)
      return c.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    return c.preferred_username?.slice(0, 2).toUpperCase() ?? '?';
  }
}
