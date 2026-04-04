import { FavoriteResponse } from '../../models/favorite.model';

export interface FavoriteState {
  favorites: FavoriteResponse[];
  loading: boolean;
  error: string | null;
}

export const initialFavoriteState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null
};
