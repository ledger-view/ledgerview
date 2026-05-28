import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { CategoryService } from './services/category.service';

export const paletteResolver: ResolveFn<void> = () => {
  const categoryService = inject(CategoryService);
  categoryService.loadColors();
  return toObservable(categoryService.colorsLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => void 0)
  );
};
