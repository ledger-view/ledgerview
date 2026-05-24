import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import packageJson from '../../../package.json';
import { authCodeFlowConfig } from '../app.config';
import { HttpAuthInterceptor } from './http-auth.interceptor';

const version = packageJson.version;

function initializeOAuth(oauthService: OAuthService): () => Promise<void> {
  return () =>
    new Promise((resolve) => {
      oauthService.configure(authCodeFlowConfig);
      oauthService.setupAutomaticSilentRefresh();
      oauthService.loadDiscoveryDocumentAndLogin().then(() => {
        if (window.location.search) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        resolve();
      });
    });
}
@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json?cacheBuster=' + version })
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true
    },
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeOAuth,
      multi: true,
      deps: [OAuthService]
    }
  ]
})
export class CoreModule {}
