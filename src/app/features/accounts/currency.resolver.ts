import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { CurrencyService } from './services/currency.service';

export const currenciesResolver: ResolveFn<void> = () => {
  const currencyService = inject(CurrencyService);
  currencyService.load();
  return toObservable(currencyService.loaded).pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => void 0)
  );
};
