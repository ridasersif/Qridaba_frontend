import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/admin/categories`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Category>): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
