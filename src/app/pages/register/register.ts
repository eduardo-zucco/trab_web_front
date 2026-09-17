import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CreateUserModel } from '../../models/create-user.model';
import { AuthService } from '../../services/auth.service';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...(confirmPassword.errors || {}), passwordMismatch: true });
    return { passwordMismatch: true };
  }

  if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
    const { passwordMismatch, ...remainingErrors } = confirmPassword.errors || {};
    confirmPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  return null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  userForm!: FormGroup;
  createUserModel!: CreateUserModel;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        userName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { userName, email, password } = this.userForm.value;
    this.createUserModel = {
      userName,
      email,
      password,
    };

    this.isLoading = true;
    this.authService.register(this.createUserModel).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
