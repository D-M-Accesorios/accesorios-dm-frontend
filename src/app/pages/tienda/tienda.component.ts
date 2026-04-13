import { Component, OnInit } from '@angular/core'; // IMPORTANTE: Agregamos OnInit aquí
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // IMPORTANTE: Para que el icono navegue
import { CartService, } from '../../services/cart.service';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, RouterLink], // Agregamos RouterLink aquí
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit {
  totalItems: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Escucha el servicio para actualizar el número del icono superior
    this.cartService.cart$.subscribe(productos => {
      this.totalItems = productos.reduce((acc, item) => acc + item.cantidad, 0);
    });
  }

  agregarAlCarrito(name: string, price: number, imagen: string) {
    const producto = { name, price, imagen };
    this.cartService.addToCart(producto);
  }
}
