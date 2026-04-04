import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteState } from './favorite.state';

export const selectFavoriteState = createFeatureSelector<FavoriteState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoriteState,
  (state: FavoriteState) => state.favorites
);

export const selectFavoriteItemIds = createSelector(
  selectAllFavorites,
  (favorites) => favorites.map(fav => fav.item?.id || fav.id) 
);

// We define a factory selector, or we just map IDs in the component
export const selectIsFavorite = (itemId: string) => createSelector(
  selectFavoriteItemIds,
  (favoriteIds) => favoriteIds.includes(itemId)
);

export const selectFavoritesLoading = createSelector(
  selectFavoriteState,
  (state: FavoriteState) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoriteState,
  (state: FavoriteState) => state.error
);
