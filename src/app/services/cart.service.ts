import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from './product.service';

export interface CartItem {
  id: number;             // id del detalle del carrito
  producto_id: number;    // id del producto
  name: string;           // nombre para mostrar
  price: number;          // precio unitario
  cantidad: number;       // cantidad
  imageUrl?: string | null; // <- AGREGADO
}

interface PaymentCartResponse {
  carrito: {
    id: number;
    usuario_id: number;
    estado: string;
    creado_en: string;
  };
  items: Array<{
    id: number;
    producto_id: number;
    cantidad: number;
    producto_nombre: string;
    precio: number;
  }>;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly usuarioId = 1;
  private readonly apiUrl = `${environment.apiBaseUrl}/payment`;

  private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);
  readonly cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private mapApiItem(item: PaymentCartResponse['items'][number]): CartItem {
    return {
      id: item.id,
      producto_id: item.producto_id,
      name: item.producto_nombre,
      price: Number(item.precio),
      cantidad: item.cantidad,
      imageUrl: null
    };
  }

  loadCart(): void {
    this.http.get<PaymentCartResponse>(`${this.apiUrl}/cart/${this.usuarioId}`).subscribe({
      next: (response) => {
        const items = (response.items ?? []).map(item => this.mapApiItem(item));
        this.cartSubject.next(items);
      },
      error: (error) => {
        console.error('Error cargando carrito:', error);
        this.cartSubject.next([]);
      }
    });
  }

  addToCart(product: Product): void {
    this.http.post(`${this.apiUrl}/cart/${this.usuarioId}/add`, {
      producto_id: product.id,
      cantidad: 1
    }).subscribe({
      next: () => this.loadCart(),
      error: (error) => console.error('Error agregando al carrito:', error)
    });
  }

  updateQuantity(item: CartItem, cambio: number): void {
    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
      this.removeFromCart(item);
      return;
    }

    this.http.put(`${this.apiUrl}/cart/item/${item.id}`, {
      cantidad: nuevaCantidad
    }).subscribe({
      next: () => this.loadCart(),
      error: (error) => console.error('Error actualizando cantidad:', error)
    });
  }

  removeFromCart(item: CartItem): void {
    this.http.delete(`${this.apiUrl}/cart/item/${item.id}`).subscribe({
      next: () => this.loadCart(),
      error: (error) => console.error('Error eliminando item:', error)
    });
  }

  clearCart(): void {
    this.http.delete(`${this.apiUrl}/cart/${this.usuarioId}/clear`).subscribe({
      next: () => this.cartSubject.next([]),
      error: (error) => console.error('Error vaciando carrito:', error)
    });
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (acc, item) => acc + item.price * item.cantidad,
      0
    );
  }
}