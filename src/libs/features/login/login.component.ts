import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../api-services/user.api.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatInput,
    MatCardHeader,
    MatError,
  ],
})
export class LoginComponent {

  private readonly userService = inject(UserApiService);
  private readonly router = inject(Router);

  readonly form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  login() {
    if (this.form.valid) {
      this.userService.login({
        email: this.form.value.email!,
        password: this.form.value.password!
      }).subscribe();
    }
  }

}
