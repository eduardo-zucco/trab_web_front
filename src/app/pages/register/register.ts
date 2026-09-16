import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CreateUserModel } from '../../models/create-user.model';
import { createMayBeForwardRefExpression } from '@angular/compiler';
import { Router } from '@angular/router';


export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
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
  imports: [ReactiveFormsModule],
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  userForm!: FormGroup;
  createUserModel!: CreateUserModel;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        userName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
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

    console.log('Payload correto enviado:', this.createUserModel);

    localStorage.setItem('token', this.createUserModel.userName);

    this.router.navigate(['/']);

  }
}
