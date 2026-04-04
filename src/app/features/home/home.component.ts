import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { ItemService } from '../../core/services/item.service';
import { Category } from '../../core/models/category.model';
import { Item } from '../../core/models/item.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import * as FavoriteActions from '../../core/store/favorites/favorite.actions';
import { selectFavoriteItemIds } from '../../core/store/favorites/favorite.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
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

  // Favorites & Auth State
  authService = inject(AuthService);
  private store = inject(Store);
  favoriteItemIds = this.store.selectSignal(selectFavoriteItemIds);
  showAuthModal = false;

  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchRecentItems();
    if (this.authService.currentUser()) {
      this.store.dispatch(FavoriteActions.loadFavorites());
    }
  }

  toggleFavorite(event: Event, item: Item) {
    event.stopPropagation();
    
    const user = this.authService.currentUser();
    if (!user) {
      this.showAuthModal = true;
      return;
    }

    const isFav = this.favoriteItemIds().includes(item.id);
    if (isFav) {
      this.store.dispatch(FavoriteActions.removeFavorite({ itemId: item.id }));
    } else {
      this.store.dispatch(FavoriteActions.addFavorite({ request: { userId: user.id, itemId: item.id } }));
    }
  }

  closeAuthModal() {
    this.showAuthModal = false;
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
}
