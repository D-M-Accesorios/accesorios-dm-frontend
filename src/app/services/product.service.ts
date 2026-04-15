import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id?: number;
  name: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api/inventory/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(() => {
        return of(this.getMockProducts());
      })
    );
  }

  private getMockProducts(): Product[] {
    return [
      {
      name: 'SET AMOR ETERNO',
      price: 65000,
      imageUrl: '/collar.png',
      category: 'COLLARES'
      },
      {
      name: 'SET DORADO PERLA',
      price: 85000,
      imageUrl: '/collar1.png',
      category: 'COLLARES'
      },
      {
        name: 'PULSERA ELEGANTE',
        price: 30000,
        imageUrl: '/pulsera.png',
        category: 'PULSERAS'
      },
      {
        name: 'ANILLO MINIMAL',
        price: 20000,
        imageUrl: '/anillo.png',
        category: 'ANILLOS'
      }
    ];
  }
}
