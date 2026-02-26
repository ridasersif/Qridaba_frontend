import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

    // Theme state using Angular signals
    currentTheme = signal<Theme>('light');

    constructor() {
        this.initializeTheme();

        // Effect to reactively update the DOM whenever currentTheme changes
        effect(() => {
            const theme = this.currentTheme();
            if (isPlatformBrowser(this.platformId)) {
                this.applyTheme(theme);
                localStorage.setItem('theme', theme);
            }
        });
    }

    toggleTheme() {
        this.currentTheme.update(prev => prev === 'light' ? 'dark' : 'light');
    }

    private initializeTheme() {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme) {
                this.currentTheme.set(savedTheme);
            } else {
                // Fallback to system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.currentTheme.set(prefersDark ? 'dark' : 'light');
            }
        }
    }

    private applyTheme(theme: Theme) {
        const htmlElement = this.document.documentElement;
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    }
}
