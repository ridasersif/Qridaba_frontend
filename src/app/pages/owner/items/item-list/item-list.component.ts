import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../../../core/services/item.service';
import { Item, ItemImageResponse } from '../../../../core/models/item.model';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error = '';
  deleteLoading: string | null = null;
  toasts: Toast[] = [];

  showToast(message: string, type: 'success' | 'error') {
    const id = Date.now();
    this.toasts.unshift({ id, message, type });
    setTimeout(() => this.removeToast(id), 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems() {
    this.loading = true;
    this.itemService.getMyItems().subscribe({
      next: (res) => {
        console.log(res.data);
        this.items = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch items', err);
        this.error = 'Failed to load inventory from server. Please try again.';
        this.loading = false;
      }
    });
  }

  showDeleteModal = false;
  itemToDelete: string | null = null;

  openDeleteModal(id: string) {
    this.itemToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    if (this.deleteLoading) return;
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  confirmDelete() {
    if (!this.itemToDelete) return;

    const id = this.itemToDelete;
    this.deleteLoading = id;

    this.itemService.deleteItem(id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== id);
        this.deleteLoading = null;
        this.closeDeleteModal();
        this.showToast('Item successfully deleted.', 'success');
      },
      error: (err) => {
        console.error('Delete failed:', err);
        const errMsg = err.error?.message || 'Failed to delete item. It might be linked to existing bookings.';
        this.showToast(errMsg, 'error');
        this.deleteLoading = null;
        this.closeDeleteModal();
      }
    });
  }

  getMainImage(item: Item): string {
    if (!item.images || item.images.length === 0) {
      return 'https://placehold.co/400/e2e8f0/64748b?text=No+Photo';
    }

    // Jackson backend serializes boolean `isMain` as `main` in JSON
    const mainImg = item.images.find((img: any) => img.main === true || img.isMain === true);
    const url = mainImg ? mainImg.imageUrl : item.images[0].imageUrl;

    // If the image URL is literal Swagger dummy data ("string") or empty, fallback to placeholder
    if (!url || url === 'string' || !url.includes('/')) {
      return 'https://placehold.co/400/e2e8f0/64748b?text=No+Photo';
    }

    return url;
  }
}
