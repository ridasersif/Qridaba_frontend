import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { ItemService } from '../../core/services/item.service';
import { AuthService } from '../../core/services/auth.service';
import { Category } from '../../core/models/category.model';
import { Item } from '../../core/models/item.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  categories: Category[] = [];
  recentItems: Item[] = [];

  loadingCategories = true;
  loadingItems = true;
  isLoadMoreLoading = false;

  // Pagination State
  currentPage = 0;
  pageSize = 8;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchRecentItems();
  }

  fetchCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        // Only keep the first 12 categories as requested by the user
        this.categories = (res.data || []).slice(0, 12);
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loadingCategories = false;
      }
    });
  }

  fetchRecentItems() {
    if (this.currentPage === 0) {
      this.loadingItems = true;
    }
    
    this.itemService.getAllItems(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.data && Array.isArray(res.data)) {
          // Fallback just in case backend didn't update yet
          this.recentItems = res.data.slice(0, 8);
        } else if (res.data && res.data.content) {
          // If first page, replace array. Otherwise, append.
          if (this.currentPage === 0) {
            this.recentItems = res.data.content;
          } else {
            this.recentItems = [...this.recentItems, ...res.data.content];
          }
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements;
        }
        this.loadingItems = false;
        this.isLoadMoreLoading = false;
      },
      error: (err) => {
        console.error('Error fetching recent items:', err);
        this.loadingItems = false;
        this.isLoadMoreLoading = false;
      }
    });
  }

  loadMoreItems() {
    if (this.currentPage < this.totalPages - 1) {
      this.isLoadMoreLoading = true;
      this.currentPage++;
      this.fetchRecentItems();
    }
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    // Check if scrolled to the right end (within a small threshold)
    // Adding Math.ceil for decimal pixel values in some browsers
    if (Math.ceil(element.scrollLeft + element.clientWidth) >= element.scrollWidth - 100) {
      if (!this.isLoadMoreLoading && this.currentPage < this.totalPages - 1 && !this.loadingItems) {
        this.loadMoreItems();
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
