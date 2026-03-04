import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  productos: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.actualizarCarrito();
  }

  actualizarCarrito(): void {
    this.productos = this.cartService.getProducts();
    this.total = this.cartService.calculateTotal();
  }

  cambiarCantidad(item: any, cambio: number): void {
    if (item.cantidad + cambio >= 1) {
      item.cantidad += cambio;
      this.total = this.cartService.calculateTotal();
    }
  }

  eliminar(item: any): void {
    const index = this.productos.indexOf(item);
    if (index > -1) {
      this.productos.splice(index, 1);
      this.total = this.cartService.calculateTotal();
    }
  }
}
