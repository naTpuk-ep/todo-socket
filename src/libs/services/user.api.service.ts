import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  username: string;
}

export interface UserDTO extends UserRegister {
  id: number;
}
export interface LoginToken {
  access_token: string;
  token_type: string;
  expires_in: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private readonly http = inject(HttpClient);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  static readonly STORAGE_TOKEN_KEY = 'todo-socket';
  static tokenGetter() {
    return localStorage.getItem(UserApiService.STORAGE_TOKEN_KEY);
  }

  register(userRegister: UserRegister): Observable<UserDTO> {
    return this.http.post<UserDTO>('/api/users', userRegister).pipe(
      tap((createdUser: UserDTO) => this.snack.open(`User ${createdUser.username} was created`, 'Close')),
      tap(() => this.router.navigate(['/login'])),
      catchError(e => {
        this.snack.open(e.error.message, 'Close');
        return throwError(e);
      })
    )
  }

  logOut() {
    localStorage.removeItem(UserApiService.STORAGE_TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  login(userLogin: UserLogin) {
    return this.http.post<LoginToken>('/api/users/login', userLogin)
      .pipe(
        tap((res) => {
          localStorage.setItem(UserApiService.STORAGE_TOKEN_KEY, res.access_token);
          this.router.navigate(['/dashboard']);
        }),
        catchError(e => {
          this.snack.open(`${e.error.message}`, 'Close');
          return throwError(e);
        })
      )
  }


  checkLoggedInAndNavigate(): boolean {
    if (UserApiService.tokenGetter()) {
      this.router.navigate(['/dashboard']);
      return true
    }
    return false;
  }
}
