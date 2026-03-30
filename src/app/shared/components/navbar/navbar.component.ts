import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Check if user role is Admin, Superadmin, or Owner
  canAccessDashboard(): boolean {
    const rawUser = this.authService.currentUser();
    if (!rawUser) return false;

    // Cast to any to safely check roles
    const user = rawUser as any;
    if (!user.roles && !user.role) return false;

    // Check if roles array or single role string is returned
    const roles: any[] = Array.isArray(user.roles) ? user.roles :
      (user.role ? [user.role] : []);

    return roles.some(r => {
      const roleName = typeof r === 'string' ? r.toUpperCase() : (r as any).name?.toUpperCase() || '';
      return roleName.includes('ADMIN') || roleName.includes('SUPERADMIN') || roleName.includes('OWNER');
    });
  }
}
