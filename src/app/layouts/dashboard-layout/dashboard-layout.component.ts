import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  isSidebarOpen = signal(true);
  authService = inject(AuthService);

  readonly isAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.roles?.includes('ADMIN') || false;
  });

  readonly isOwner = computed(() => {
    const user = this.authService.currentUser();
    return user?.roles?.includes('OWNER') || false;
  });

  adminNavItems = [
    { label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/admin/dashboard' },
    { label: 'Users', icon: 'lucide:users', path: '/admin/users' },
    { label: 'Categories', icon: 'lucide:shapes', path: '/admin/categories' },
    { label: 'Roles', icon: 'lucide:shield', path: '/admin/roles' },
  ];

  ownerNavItems = [
    { label: 'Dashboard', icon: 'lucide:bar-chart-3', path: '/owner/dashboard' },
    { label: 'My Items', icon: 'lucide:package', path: '/owner/items' },
    { label: 'Bookings', icon: 'lucide:calendar-check', path: '/owner/bookings' },
  ];

  get navItems() {
    if (this.isAdmin()) return this.adminNavItems;
    if (this.isOwner()) return this.ownerNavItems;
    return [];
  }

  get panelTitle() {
    if (this.isAdmin()) return 'Admin Panel';
    if (this.isOwner()) return 'Owner Dashboard';
    return 'Menu';
  }

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }
}
