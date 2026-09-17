import { booleanAttribute, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from '../../models/login.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  userForm!: FormGroup;
  loginModel!: LoginModel;

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}


  ngOnInit(): void {
    this.userForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [true]
      },
    );
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { email, password, remember} = this.userForm.value;

    

    this.loginModel = {
      email,
      password
    }

    this.isLoading = true;
    this.authService.login(this.loginModel, remember).subscribe({
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
