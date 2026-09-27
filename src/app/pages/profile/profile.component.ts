import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { UserGetModel } from '../../models/user-get.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  public profileForm!: FormGroup;
  public passwordForm!: FormGroup;
  public isLoading = false;
  public isSaving = false;
  public isChangingPassword = false;
  public showCurrentPassword = false;
  public showNewPassword = false;
  public showConfirmPassword = false;
  public userData: UserGetModel | null = null;

  public get currentUser() {
    return this.authService.getCurrentUser();
  }

  public get initials(): string {
    const name = this.currentUser?.name ?? 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.loadProfile();
  }

  private loadProfile(): void {
    const cached = this.currentUser;
    if (cached) {
      this.profileForm.patchValue({
        userName: cached.name,
        email: cached.email,
      });
    }

    this.isLoading = true;
    this.userService.getMe().subscribe({
      next: (res) => {
        if (res.data) {
          this.userData = res.data;
          this.profileForm.patchValue({
            userName: res.data.name,
            email: res.data.email,
          });
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  public saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const { userName, email } = this.profileForm.value;

    this.userService.updateMe({ userName, email }).subscribe({
      next: (res) => {
        if (res.data) {
          this.authService.updateCurrentUser({ name: res.data.name, email: res.data.email });
          this.toastService.success('Perfil atualizado com sucesso!');
        }
        this.isSaving = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSaving = false;
        this.cdr.markForCheck();
      }
    });
  }

  public changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.toastService.error('As senhas não coincidem.');
      return;
    }

    const { userName, email } = this.profileForm.value;
    this.isChangingPassword = true;

    this.userService.updateMe({ userName, email, password }).subscribe({
      next: () => {
        this.toastService.success('Senha alterada com sucesso!');
        this.passwordForm.reset();
        this.isChangingPassword = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isChangingPassword = false;
        this.cdr.markForCheck();
      }
    });
  }
}
