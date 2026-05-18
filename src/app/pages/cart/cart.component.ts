import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CartItem, CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  items: CartItem[] = [];

  constructor(private readonly cartService: CartService) {
    this.cartService.items$.subscribe((items) => {
      this.items = items;
    });
  }

  increase(productId: string): void {
    this.cartService.increaseProduct(productId);
  }

  decrease(productId: string): void {
    this.cartService.decreaseProduct(productId);
  }

  removeProduct(productId: string): void {
    this.cartService.removeProduct(productId);
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  get total(): number {
    return this.cartService.getTotal();
  }
}