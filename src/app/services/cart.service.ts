import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../factories/product.factory';

export interface CartItem extends Product {
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: CartItem[] = [];

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  addToCart(product: Product) {
  console.log("ANTES:", this.cart);

  const existing = this.cart.find(p => p.name === product.name);

  if (existing) {
    existing.cantidad += 1;
  } else {
    this.cart.push({ ...product, cantidad: 1 });
  }

  console.log("DESPUÉS:", this.cart);

  this.cartSubject.next([...this.cart]); // 👈 IMPORTANTE (copia)
}

  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter(p => p !== item);
    this.cartSubject.next(this.cart);
  }

  updateQuantity(item: CartItem, change: number) {
    const found = this.cart.find(p => p === item);
    if (found) {
      found.cantidad += change;
      if (found.cantidad < 1) found.cantidad = 1;
    }
    this.cartSubject.next(this.cart);
  }

  getTotal(): number {
    return this.cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);
  }
}
