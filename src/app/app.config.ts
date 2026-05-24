import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.keycloakIssuer,
  redirectUri: window.location.origin,
  clientId: 'ledgerview-web',
  responseType: 'code',
  scope: 'openid profile',
  sessionChecksEnabled: false
};
