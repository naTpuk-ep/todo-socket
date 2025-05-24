import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STORAGE_TOKEN_KEY } from '../../app/app.config';

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

  register(userRegister: UserRegister): Observable<UserDTO> {
    return this.http.post<UserDTO>('/api/users', userRegister).pipe(
      tap((createdUser: UserDTO) => this.snack.open(`User ${createdUser.username} was created`, 'Close')),
      catchError(e => {
        this.snack.open(e.error.message, 'Close');
        return throwError(e);
      })
    )
  }

  login(userLogin: UserLogin): Observable<LoginToken> {
    return this.http.post<LoginToken>('/api/users/login', userLogin)
      .pipe(
        tap((res) => localStorage.setItem(STORAGE_TOKEN_KEY, res.access_token)),
        catchError(e => {
          this.snack.open(`${e.error.message}`, 'Close');
          return throwError(e);
        })
      );
  }
}
