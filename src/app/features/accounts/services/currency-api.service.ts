import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrencyProperties } from '@model/currency.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurrencyApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/currencies`;

  constructor(private http: HttpClient) {}

  getCurrencies$(): Observable<CurrencyProperties> {
    return this.http.get<CurrencyProperties>(this.baseUrl);
  }
}
