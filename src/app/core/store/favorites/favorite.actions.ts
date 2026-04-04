import { createAction, props } from '@ngrx/store';
import { FavoriteRequest, FavoriteResponse } from '../../models/favorite.model';

// Load User Favorites
export const loadFavorites = createAction('[Favorite] Load Favorites');
export const loadFavoritesSuccess = createAction(
  '[Favorite] Load Favorites Success',
  props<{ favorites: FavoriteResponse[] }>()
);
export const loadFavoritesFailure = createAction(
  '[Favorite] Load Favorites Failure',
  props<{ error: string }>()
);

// Add Favorite
export const addFavorite = createAction(
  '[Favorite] Add Favorite',
  props<{ request: FavoriteRequest }>()
);
export const addFavoriteSuccess = createAction(
  '[Favorite] Add Favorite Success',
  props<{ response: FavoriteResponse }>()
);
export const addFavoriteFailure = createAction(
  '[Favorite] Add Favorite Failure',
  props<{ error: string }>()
);

// Remove Favorite
export const removeFavorite = createAction(
  '[Favorite] Remove Favorite',
  props<{ itemId: string }>()
);
export const removeFavoriteSuccess = createAction(
  '[Favorite] Remove Favorite Success',
  props<{ itemId: string }>()
);
export const removeFavoriteFailure = createAction(
  '[Favorite] Remove Favorite Failure',
  props<{ error: string }>()
);
