import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent { }
