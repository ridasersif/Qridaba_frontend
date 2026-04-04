import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { FavoriteRequest, FavoriteResponse } from '../models/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/user/favorites`;

  addFavorite(request: FavoriteRequest): Observable<ApiResponse<FavoriteResponse>> {
    return this.http.post<ApiResponse<FavoriteResponse>>(this.API_URL, request);
  }

  removeFavorite(itemId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_URL}/${itemId}`);
  }

  getUserFavorites(): Observable<ApiResponse<FavoriteResponse[]>> {
    return this.http.get<ApiResponse<FavoriteResponse[]>>(this.API_URL);
  }

  checkIfFavorite(itemId: string): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.API_URL}/check/${itemId}`);
  }
}
