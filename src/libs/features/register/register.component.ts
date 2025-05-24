import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserApiService } from '../../api-services/user.api.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormValidator } from '../../utils/form-validator';


@Component({
  selector: 'app-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    CommonModule,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatFormField,
    MatError,
  ],
})
export class RegisterComponent {
  readonly form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    passwordConfirm: ['', [Validators.required]]
  },
    { validators: FormValidator.validatorPasswordsMatching }
  )

  private readonly userService = inject(UserApiService);
  private readonly router = inject(Router);

  register() {
    if(this.form.valid) {
      this.userService
        .register({
          email: this.form.value.email!,
          username: this.form.value.username!,
          password: this.form.value.password!
        })
        .pipe(tap(() => this.router.navigate(['login'])))
        .subscribe();
    }
  }
}
