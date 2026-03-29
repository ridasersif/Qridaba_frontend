import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.currentUser();
  const requiredRoles = route.data['roles'] as string[];

  // User is not logged in at all -> send to home or login
  if (!user) {
    router.navigate(['/']);
    return false;
  }

  // Route requires specific roles, check if user has at least one of them
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(role => user.roles?.includes(role));
    if (!hasRole) {
      router.navigate(['/']); // User doesn't have the role, redirect to home
      return false;
    }
  }

  return true; // Access granted
};
