import { AbstractControl, ValidationErrors } from '@angular/forms';


export class FormValidator {
  static validatorPasswordsMatching = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    if(password?.value && passwordConfirm?.value && password?.touched && passwordConfirm?.touched && (password?.value !== passwordConfirm?.value)) {
      return { passwordsNotMatching: true };
    } else {
      return null;
    }
  }
}
