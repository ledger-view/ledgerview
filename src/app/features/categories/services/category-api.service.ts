import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CategoryRequest, ColorPaletteProperties } from '@model/category.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  private readonly apiUrl = (path: string | number = '') => `${environment.apiBaseUrl}/api/categories${path ? '/' + path : ''}`;

  constructor(private http: HttpClient) {}

  getColorPalette$(): Observable<ColorPaletteProperties> {
    return this.http.get<ColorPaletteProperties>(`${this.apiUrl('palette')}`);
  }

  getCategories$(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl());
  }

  createCategory$(data: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl(), data);
  }

  updateCategory$(id: string, data: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(this.apiUrl(id), data);
  }

  deleteCategory$(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl(id));
  }
}
