import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IdentityClaims } from '@model/auth.model';

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

  public ngOnInit(): void {
    this.translateService.setFallbackLang('en');
    this.translateService.use('en');
  }

  protected logout(): void {
    this.oauthService.logOut();
  }

  protected get identityClaims(): IdentityClaims | null {
    return (this.oauthService.getIdentityClaims() as IdentityClaims) ?? null;
  }
}
