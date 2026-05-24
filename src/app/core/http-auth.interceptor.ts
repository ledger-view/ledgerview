import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(
    private oauthService: OAuthService,
    private errorHandler: ErrorHandler
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    const token = this.oauthService.getAccessToken();
    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(request).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (!(error instanceof HttpErrorResponse)) {
            console.error('Interceptor error:', error);
          }
          if (error.status === 401) {
            this.oauthService.logOut(true);
            this.oauthService.initCodeFlow();
            return;
          }
          this.errorHandler.handleError(error);
        }
      })
    );
  }
}
