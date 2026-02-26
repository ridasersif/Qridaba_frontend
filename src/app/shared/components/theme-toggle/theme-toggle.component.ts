import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      (click)="themeService.toggleTheme()"
      class="p-2.5 rounded-xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/30 transition-all duration-300 group relative shadow-sm"
      [title]="themeService.currentTheme() === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
    >
      <!-- Sun Icon (Light Mode) -->
      <svg
        *ngIf="themeService.currentTheme() === 'dark'"
        class="w-5 h-5 transition-transform duration-500 rotate-0 scale-100 group-hover:rotate-90 text-amber-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>

      <!-- Moon Icon (Dark Mode) -->
      <svg
        *ngIf="themeService.currentTheme() === 'light'"
        class="w-5 h-5 transition-transform duration-500 rotate-0 scale-100 group-hover:-rotate-12 text-indigo-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      <!-- Subtle Glow Effect on Hover -->
      <div class="absolute inset-0 rounded-xl bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </button>
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ThemeToggleComponent {
    themeService = inject(ThemeService);
}
