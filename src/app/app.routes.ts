import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { HomeComponent } from './features/home/home.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'items/:id',
        loadComponent: () => import('./pages/item-details/item-details.component').then(m => m.ItemDetailsComponent)
    },
    {
        path: 'admin',
        component: DashboardLayoutComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./pages/admin/categories/category-list/category-list.component').then(m => m.CategoryListComponent)
            },
            {
                path: 'categories/new',
                loadComponent: () => import('./pages/admin/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
            },
            {
                path: 'categories/:id',
                loadComponent: () => import('./pages/admin/categories/category-form/category-form.component').then(m => m.CategoryFormComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/admin/users/user-list/user-list.component').then(m => m.UserListComponent)
            },
            {
                path: 'users/new',
                loadComponent: () => import('./pages/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
            },
            {
                path: 'users/:id',
                loadComponent: () => import('./pages/admin/users/user-form/user-form.component').then(m => m.UserFormComponent)
            },
            {
                path: 'roles',
                loadComponent: () => import('./pages/admin/roles/role-list/role-list.component').then(m => m.RoleListComponent)
            },
            {
                path: 'roles/new',
                loadComponent: () => import('./pages/admin/roles/role-form/role-form.component').then(m => m.RoleFormComponent)
            },
            {
                path: 'roles/:id',
                loadComponent: () => import('./pages/admin/roles/role-form/role-form.component').then(m => m.RoleFormComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'owner',
        component: DashboardLayoutComponent,
        canActivate: [roleGuard],
        data: { roles: ['OWNER'] },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) // Placeholder owner dashboard
            },
            {
                path: 'items',
                loadComponent: () => import('./pages/owner/items/item-list/item-list.component').then(m => m.ItemListComponent)
            },
            {
                path: 'items/new',
                loadComponent: () => import('./pages/owner/items/item-form/item-form.component').then(m => m.ItemFormComponent)
            },
            {
                path: 'items/:id',
                loadComponent: () => import('./pages/owner/items/item-form/item-form.component').then(m => m.ItemFormComponent)
            },
            {
                path: 'bookings',
                loadComponent: () => import('./pages/owner/bookings/bookings-list/bookings-list.component').then(m => m.BookingsListComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
