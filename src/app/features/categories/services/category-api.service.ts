import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CategoryRequest } from '@model/category.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/categories`;

  constructor(private http: HttpClient) {}

  getCategories$(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  createCategory$(data: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, data);
  }

  updateCategory$(id: string, data: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, data);
  }

  deleteCategory$(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
