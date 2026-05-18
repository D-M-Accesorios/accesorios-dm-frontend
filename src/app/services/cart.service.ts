import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

 addProduct(product: Product): void {
  const items = this.itemsSubject.value;
  const existingItem = items.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
    this.itemsSubject.next([...items]);
    this.openDrawer();
    return;
  }

  this.itemsSubject.next([...items, { product, quantity: 1 }]);
  this.openDrawer();
}

  removeProduct(productId: string): void {
    const items = this.itemsSubject.value.filter(
      (item) => item.product.id !== productId
    );

    this.itemsSubject.next(items);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getCount(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
  private readonly drawerOpenSubject = new BehaviorSubject<boolean>(false);
drawerOpen$ = this.drawerOpenSubject.asObservable();

openDrawer(): void {
  this.drawerOpenSubject.next(true);
}

closeDrawer(): void {
  this.drawerOpenSubject.next(false);
}
increaseProduct(productId: string): void {
  const items = this.itemsSubject.value.map((item) =>
    item.product.id === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  this.itemsSubject.next(items);
}

decreaseProduct(productId: string): void {
  const items = this.itemsSubject.value
    .map((item) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  this.itemsSubject.next(items);
}
}