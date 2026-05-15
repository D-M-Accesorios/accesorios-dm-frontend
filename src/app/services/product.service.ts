import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { ProductFactory } from '../factories/product.factory';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl =
    `${environment.apiBaseUrl}/inventory/productos`

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response) => ProductFactory.fromApiList(response)),
      catchError((error) => {
        console.error('Error al obtener productos:', error);
        return of([]);
      })
    );
  }
}