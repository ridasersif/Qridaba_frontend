import { createReducer, on } from '@ngrx/store';
import { initialFavoriteState, FavoriteState } from './favorite.state';
import * as FavoriteActions from './favorite.actions';

export const favoriteReducer = createReducer(
  initialFavoriteState,

  // Load Favorites
  on(FavoriteActions.loadFavorites, (state): FavoriteState => ({
    ...state,
    loading: true,
    error: null
  })),
  on(FavoriteActions.loadFavoritesSuccess, (state, { favorites }): FavoriteState => ({
    ...state,
    favorites: [...favorites],
    loading: false,
    error: null
  })),
  on(FavoriteActions.loadFavoritesFailure, (state, { error }): FavoriteState => ({
    ...state,
    loading: false,
    error
  })),

  // Add Favorite
  on(FavoriteActions.addFavoriteSuccess, (state, { response }): FavoriteState => ({
    ...state,
    favorites: [...state.favorites, response]
  })),
  on(FavoriteActions.addFavoriteFailure, (state, { error }): FavoriteState => ({
    ...state,
    error
  })),

  // Remove Favorite
  on(FavoriteActions.removeFavoriteSuccess, (state, { itemId }): FavoriteState => ({
    ...state,
    favorites: state.favorites.filter(fav => fav.item?.id !== itemId && fav.id !== itemId)
  })),
  on(FavoriteActions.removeFavoriteFailure, (state, { error }): FavoriteState => ({
    ...state,
    error
  }))
);
