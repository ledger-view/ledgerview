import { Injectable, signal } from '@angular/core';
import { Category, CategoryRequest } from '@model/category.model';
import { tap } from 'rxjs';
import { CategoryApiService } from './category-api.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private _categories = signal<Category[]>([]);
  private _loading = signal(false);
  private _loaded = signal(false);

  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  constructor(private api: CategoryApiService) {}

  load(): void {
    this._loading.set(true);
    this.api.getCategories$().subscribe({
      next: (c) => {
        this._categories.set(c);
        this._loading.set(false);
        this._loaded.set(true);
      },
      error: () => {
        this._loading.set(false);
        this._loaded.set(true);
      }
    });
  }

  create$(data: CategoryRequest) {
    return this.api.createCategory$(data).pipe(tap((created) => this._categories.update((list) => [...list, created])));
  }

  update$(id: string, data: CategoryRequest) {
    return this.api
      .updateCategory$(id, data)
      .pipe(tap((updated) => this._categories.update((list) => list.map((c) => (c.id === id ? updated : c)))));
  }

  delete$(id: string) {
    return this.api.deleteCategory$(id).pipe(tap(() => this._categories.update((list) => list.filter((c) => c.id !== id))));
  }
}
