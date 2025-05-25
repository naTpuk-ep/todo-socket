import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserApiService } from '../../services/user.api.service';
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
    RouterLink,
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

  register() {
    if(this.form.valid) {
      this.userService
        .register({
          email: this.form.value.email!,
          username: this.form.value.username!,
          password: this.form.value.password!
        })
        .subscribe();
    }
  }
}
