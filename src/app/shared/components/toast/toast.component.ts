import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .toast-enter {
      animation: toastIn 0.22s cubic-bezier(.21,1.02,.73,1) forwards;
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(18px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
  template: `
    <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts(); trackBy: trackById"
        class="toast-enter flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl min-w-[280px] max-w-sm pointer-events-auto backdrop-blur-md border"
        [ngClass]="{
          'bg-emerald-500/95 text-white border-emerald-400/50': toast.type === 'success',
          'bg-rose-500/95 text-white border-rose-400/50': toast.type === 'error',
          'bg-slate-800/95 text-white border-slate-600/50': toast.type === 'info'
        }">
        <span class="iconify text-xl shrink-0"
          [attr.data-icon]="toast.type === 'success' ? 'lucide:check-circle' : toast.type === 'error' ? 'lucide:x-circle' : 'lucide:info'">
        </span>
        <span class="font-semibold text-sm leading-relaxed flex-1">{{ toast.message }}</span>
        <button class="opacity-70 hover:opacity-100 transition-opacity ml-1"
          (click)="toastService.dismiss(toast.id)">
          <span class="iconify text-lg" data-icon="lucide:x"></span>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
  trackById = (_: number, t: any) => t.id;
}
