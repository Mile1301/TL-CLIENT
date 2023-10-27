import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('login') || request.url.includes('register')) {
      return next.handle(request);
    }
    const user = this.authService.currentUser$.value;

    if (!user) return next.handle(request);

    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return next.handle(clonedRequest).pipe(
      catchError((err) => {
        console.log(err);
        if (err.status === 403 && !err.url.includes('refresh-token')) {
          return this.authService.refreshAccessToken().pipe(
            switchMap((value) => {
              const clonedRequest = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${value.token}`,
                },
              });
              return next.handle(clonedRequest);
            })
          );
        }
        this.authService.logoutUserFromClient();

        return EMPTY;
      })
    );
  }
}
