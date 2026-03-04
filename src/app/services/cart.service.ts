import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartList: any[] = [];
  private _cart = new BehaviorSubject<any[]>([]);
  cart$ = this._cart.asObservable();

  constructor() { }

  addToCart(product: any) {
    const exist = this.cartList.find(item => item.nombre === product.nombre);
    if (exist) {
      exist.cantidad += 1;
    } else {
      this.cartList.push({ ...product, cantidad: 1 });
    }
    this._cart.next(this.cartList);
  }

  getProducts() {
    return this.cartList;
  }

  // Calcula el total sumando (precio * cantidad) de cada item
  calculateTotal(): number {
    return this.cartList.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }
}
