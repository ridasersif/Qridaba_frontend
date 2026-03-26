import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { RoleService, RoleResponse } from '../../../../core/services/role.service';
import { RegisterRequest } from '../../../../core/models/auth.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  serverErrors = signal<Record<string, string>>({});
  showPassword = signal<boolean>(false);
  roles = signal<RoleResponse[]>([]); // To store assignable roles

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: ['', [Validators.required]] // Mandatory select
  });

  passwordStrength = signal<number>(0);

  strengthLabel = computed(() => {
    const s = this.passwordStrength();
    if (s === 0) return '';
    if (s < 40) return 'Weak';
    if (s < 70) return 'Medium';
    return 'Strong';
  });

  strengthColor = computed(() => {
    const s = this.passwordStrength();
    if (s < 40) return 'bg-red-500';
    if (s < 70) return 'bg-amber-500 transition-colors duration-500';
    return 'bg-emerald-500 transition-colors duration-500';
  });

  ngOnInit(): void {
    this.loadRoles();

    // Listen to password changes for strength meter
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      this.calculateStrength(val || '');
    });
  }

  loadRoles(): void {
    this.roleService.getAssignableRoles().subscribe({
      next: (data: RoleResponse[]) => this.roles.set(data),
      error: (err: any) => console.error('Error fetching roles', err)
    });
  }

  calculateStrength(pwd: string): void {
    if (!pwd) {
      this.passwordStrength.set(0);
      return;
    }

    const hasLetters = /[a-z]/i.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    let score = 0;

    // Weak: Only letters OR only numbers
    if ((hasLetters && !hasNumbers) || (!hasLetters && hasNumbers)) {
      score = Math.min(pwd.length * 4, 35); // Max 35% for weak
    }
    // Medium: Letters AND numbers
    else if (hasLetters && hasNumbers) {
      score = 40 + Math.min(pwd.length * 2, 25); // Starts at 40%, max 65% for medium

      // Strong: Numbers, Caps, Small, and Special
      if (hasUpper && hasLower && hasSpecial) {
        score = 70 + Math.min(pwd.length * 2, 30); // Starts at 70%, max 100%
      }
    }

    this.passwordStrength.set(Math.min(score, 100));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.serverErrors.set({});

      const request: RegisterRequest = this.registerForm.value as RegisterRequest;

      this.authService.register(request).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Redirection to verification after success
          this.router.navigate(['/auth/verify-email'], {
            queryParams: { email: request.email }
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.errors) {
            this.serverErrors.set(err.errors);
          }
        }
      });
    }
  }
}