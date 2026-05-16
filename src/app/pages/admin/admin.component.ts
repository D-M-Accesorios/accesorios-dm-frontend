import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product.model';
import {
  Category,
  CreateProductRequest,
  Material,
  ProductService
} from '../../services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  materials: Material[] = [];

  newProduct = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    idCategoria: 0,
    idMaterial: 0
  };

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadMaterials();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  loadMaterials(): void {
    this.productService.getMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
      }
    });
  }

 saveProduct(): void {
  if (
    !this.newProduct.nombre.trim() ||
    !this.newProduct.descripcion.trim() ||
    Number(this.newProduct.precio) <= 0 ||
    Number(this.newProduct.stock) <= 0 ||
    Number(this.newProduct.idCategoria) <= 0 ||
    Number(this.newProduct.idMaterial) <= 0
  ) {
    alert('Completa todos los campos. Precio y stock deben ser mayores a 0.');
    return;
  }

  const product: CreateProductRequest = {
    nombre: this.newProduct.nombre,
    descripcion: this.newProduct.descripcion,
    precio: Number(this.newProduct.precio),
    stock: Number(this.newProduct.stock),
    categoria: { idCategoria: Number(this.newProduct.idCategoria) },
    material: { idMaterial: Number(this.newProduct.idMaterial) },
    estado: true
  };

  this.productService.createProduct(product).subscribe({
    next: () => {
      this.newProduct = {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        idCategoria: 0,
        idMaterial: 0
      };

      this.loadProducts();
    },
    error: (error) => {
      console.error('Error al crear producto:', error);
    }
  });
}
}