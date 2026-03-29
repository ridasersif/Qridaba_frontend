import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Item } from '../models/item.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private http = inject(HttpClient);
  // Using the exact path setup based on backend configuration.
  // WebConfig.java sets the global prefix /api/v1.
  // ItemController.java sets the RequestMapping to /items.
  // Therefore the exact endpoint is /api/v1/items.
  private apiUrl = `${environment.apiUrl}/items`;

  getAllItems(): Observable<ApiResponse<Item[]>> {
    return this.http.get<ApiResponse<Item[]>>(this.apiUrl);
  }

  getMyItems(): Observable<ApiResponse<Item[]>> {
    return this.http.get<ApiResponse<Item[]>>(`${this.apiUrl}/my-items`);
  }

  getItemById(id: string): Observable<ApiResponse<Item>> {
    return this.http.get<ApiResponse<Item>>(`${this.apiUrl}/${id}`);
  }

  createItem(itemJson: string, images: File[]): Observable<ApiResponse<Item>> {
    const formData = new FormData();
    formData.append('item', itemJson);
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    return this.http.post<ApiResponse<Item>>(this.apiUrl, formData);
  }

  updateItem(id: string, itemJson: string, images?: File[]): Observable<ApiResponse<Item>> {
    const formData = new FormData();
    formData.append('item', itemJson);
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    return this.http.put<ApiResponse<Item>>(`${this.apiUrl}/${id}`, formData);
  }

  deleteItem(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
