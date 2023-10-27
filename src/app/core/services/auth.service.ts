import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { RegisterUserReq, User } from '../models/user.model';
import { AuthApiService } from './api/auth-api.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private authApiService = inject(AuthApiService);
  private notificationService = inject(NotificationService);

  currentUser$ = new BehaviorSubject<User>(this.getUserFromLocalStorage());

  registerUser(reqBody: RegisterUserReq) {
    this.authApiService.registerUser(reqBody).subscribe({
      next: () => {
        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loginUser(email: string, password: string) {
    // console.log(email, password);
    this.authApiService.loginUser(email, password).subscribe({
      next: (response) => {
        const token = response.headers.get('access-token');
        const refreshToken = response.headers.get('refresh-token');
        // console.log(token, refreshToken);

        const user = response.body as User;

        user.token = token;
        user.refreshToken = refreshToken;
        // console.log(user);

        this.saveUserInLocalStorage(user);
        this.currentUser$.next(user);
        this.router.navigate(['posts']);
        this.notificationService.showSuccess('Successfully Logged In');
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showError(err.error.message);
      },
    });
  }

  saveUserInLocalStorage(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User | null {
    const stringUserData = localStorage.getItem('currentUser');

    return stringUserData ? JSON.parse(stringUserData) : null;
  }

  refreshAccessToken() {
    const refreshToken = this.currentUser$.value?.refreshToken;

    return this.authApiService.refreshAccessToken(refreshToken).pipe(
      map((res) => {
        const token = res.headers.get('access-token');
        const refreshToken = res.headers.get('refresh-token');
        return { token, refreshToken };
      }),
      tap((value) => {
        const user = this.currentUser$.value;
        const { token, refreshToken } = value;
        if (user) {
          const updatedUser: User = {
            ...user,
            token,
            refreshToken,
          };
          this.saveUserInLocalStorage(updatedUser);
          this.currentUser$.next(updatedUser);
        }
      })
    );
  }

  logoutUser() {
    const refreshToken = this.currentUser$.value?.refreshToken;

    this.authApiService.logoutUserFromServer(refreshToken).subscribe({
      next: () => {
        this.notificationService.showSuccess('User logged out successfully!');
        this.logoutUserFromClient();
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showError(err.error.message);
        this.logoutUserFromClient();
      },
    });
  }

  logoutAll() {
    this.authApiService.logoutAllFromServer().subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'User logged out from all devices successfully!'
        );
        this.logoutUserFromClient();
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showError(err);
        this.logoutUserFromClient();
      },
    });
  }

  logoutUserFromClient() {
    this.currentUser$.next(null);
    localStorage.clear();
    this.router.navigate(['']);
  }
}
