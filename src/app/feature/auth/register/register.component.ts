import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterUserReq } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  registerForm: FormGroup;
  ngOnInit(): void {
    this.initForm();
    console.log(this.registerForm);
  }
  initForm() {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      this.confirmPasswordValidator
    );
  }

  confirmPasswordValidator = (formGroup: any) => {
    if (
      formGroup.controls.password.value !==
      formGroup.controls.confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  };

  onFormSubmit() {
    // console.log(this.registerForm.value);
    console.log('form submitted');
    delete this.registerForm.value.confirmPassword;
    const reqBody: RegisterUserReq = this.registerForm.value;

    this.authService.registerUser(reqBody);
  }
}
