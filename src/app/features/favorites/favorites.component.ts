import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import * as FavoriteActions from '../../core/store/favorites/favorite.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../core/store/favorites/favorite.selectors';
import { AuthService } from '../../core/services/auth.service';
import { FavoriteResponse } from '../../core/models/favorite.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  favorites = this.store.selectSignal(selectAllFavorites);
  loading = this.store.selectSignal(selectFavoritesLoading);

  ngOnInit(): void {
    if (this.authService.currentUser() && this.favorites().length === 0) {
      this.store.dispatch(FavoriteActions.loadFavorites());
    }
  }

  removeFavorite(itemId: string) {
    this.store.dispatch(FavoriteActions.removeFavorite({ itemId }));
  }
}
