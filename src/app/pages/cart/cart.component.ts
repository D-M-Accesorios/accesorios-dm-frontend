import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  productos: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
  this.cartService.cart$.subscribe(data => {
    console.log("CARRITO RECIBIDO:", data); // 👈 DEBUG
    this.productos = data;
    this.total = this.cartService.getTotal();
  });
}

  cambiarCantidad(item: CartItem, cambio: number): void {
    this.cartService.updateQuantity(item, cambio);
  }

  eliminar(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }
}
