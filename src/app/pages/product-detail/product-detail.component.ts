import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'No se encontró el producto seleccionado.';
      this.isLoading = false;
      return;
    }

    this.productService.getProductById(id).subscribe((product) => {
      this.product = product;
      this.isLoading = false;

      if (!product) {
        this.errorMessage = 'No fue posible cargar el detalle del producto.';
      }
    });
  }

  get imageUrl(): string {
    return this.product?.imageUrl && !this.product.imageUrl.includes('product-placeholder.png')
      ? this.product.imageUrl
      : 'https://placehold.co/600x480?text=Producto';
  }
}