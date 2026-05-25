import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  constructor(
    private translateService: TranslateService,
    private oauthService: OAuthService
  ) {}

  ngOnInit(): void {
    this.translateService.setFallbackLang('en');
    this.translateService.use('en');
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
