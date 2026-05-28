import { Injectable, signal } from '@angular/core';
import { CurrencyApiService } from './currency-api.service';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private _fiat = signal<string[]>([]);
  private _crypto = signal<string[]>([]);
  private _loaded = signal(false);

  readonly fiat = this._fiat.asReadonly();
  readonly crypto = this._crypto.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  constructor(private api: CurrencyApiService) {}

  load(): void {
    if (this._loaded()) return;
    this.api.getCurrencies$().subscribe({
      next: ({ fiat, crypto }) => {
        this._fiat.set(fiat);
        this._crypto.set(crypto);
        this._loaded.set(true);
      },
      error: () => this._loaded.set(true)
    });
  }
}
