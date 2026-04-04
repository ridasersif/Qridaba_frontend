import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { FavoriteService } from '../../services/favorite.service';
import { ToastService } from '../../services/toast.service';
import * as FavoriteActions from './favorite.actions';

@Injectable()
export class FavoriteEffects {
  private actions$ = inject(Actions);
  private favoriteService = inject(FavoriteService);
  private toastService = inject(ToastService);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteActions.loadFavorites),
      switchMap(() =>
        this.favoriteService.getUserFavorites().pipe(
          map((response) => FavoriteActions.loadFavoritesSuccess({ favorites: response.data })),
          catchError((error) => of(FavoriteActions.loadFavoritesFailure({ error: error.message })))
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteActions.addFavorite),
      switchMap((action) =>
        this.favoriteService.addFavorite(action.request).pipe(
          tap(() => this.toastService.success('❤️ Added to your favorites!')),
          // Reload full list to get nested item object from backend
          map(() => FavoriteActions.loadFavorites()),
          catchError((err) => {
            const errorMessage = err.error?.message || 'Failed to add favorite. Please try again.';
            this.toastService.error(errorMessage);
            return of(FavoriteActions.addFavoriteFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteActions.removeFavorite),
      switchMap((action) =>
        this.favoriteService.removeFavorite(action.itemId).pipe(
          tap(() => this.toastService.info('Removed from your favorites.')),
          map(() => FavoriteActions.loadFavorites()),
          catchError((err) => {
            const errorMessage = err.error?.message || 'Failed to remove favorite. Please try again.';
            this.toastService.error(errorMessage);
            return of(FavoriteActions.removeFavoriteFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
}
