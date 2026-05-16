import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product.model';
import {
  Category,
  CreateProductRequest,
  Material,
  ProductService,
  UpdateProductRequest
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
  editingProductId: string | null = null;

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

      this.products.forEach((product, index) => {
        this.productService.getProductById(product.id).subscribe({
          next: (detail: any) => {
            if (!detail) {
              return;
            }

            this.products[index] = {
              ...this.products[index],
              description: detail.descripcion ?? this.products[index].description,
              stock: Number(detail.stock ?? this.products[index].stock),
              category: detail.categoria?.nombre ?? this.products[index].category,
              material: detail.material?.nombre ?? this.products[index].material
            };
          }
        });
      });
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
    if (!this.isFormValid()) {
      alert('Completa todos los campos. Precio y stock deben ser mayores a 0.');
      return;
    }

    const product = this.buildProductRequest();

    if (this.editingProductId) {
      this.productService
        .updateProduct(this.editingProductId, product as UpdateProductRequest)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
          }
        });

      return;
    }

    this.productService.createProduct(product).subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
      }
    });
  }

editProduct(product: Product): void {
  this.productService.getProductById(product.id).subscribe({
    next: (response: any) => {
      if (!response) {
        return;
      }

      this.editingProductId = String(response.idProducto ?? response.id ?? product.id);

      this.newProduct = {
        nombre: response.nombre ?? '',
        descripcion: response.descripcion ?? '',
        precio: Number(response.precio ?? 0),
        stock: Number(response.stock ?? 0),
        idCategoria: Number(response.categoria?.idCategoria ?? 0),
        idMaterial: Number(response.material?.idMaterial ?? 0)
      };
    },
    error: (error) => {
      console.error('Error cargando detalle del producto:', error);
    }
  });
}

  cancelEdit(): void {
    this.resetForm();
  }
private findCategoryId(categoryName?: string): number {
  const category = this.categories.find(
    (item) => item.nombre === categoryName
  );

  return category?.idCategoria ?? 0;
}

private findMaterialId(materialName?: string): number {
  const material = this.materials.find(
    (item) => item.nombre === materialName
  );

  return material?.idMaterial ?? 0;
}
  deleteProduct(product: Product): void {
    const confirmDelete = confirm(`¿Eliminar el producto "${product.name}"?`);

    if (!confirmDelete) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }

  private isFormValid(): boolean {
    return (
      !!this.newProduct.nombre.trim() &&
      !!this.newProduct.descripcion.trim() &&
      Number(this.newProduct.precio) > 0 &&
      Number(this.newProduct.stock) > 0 &&
      Number(this.newProduct.idCategoria) > 0 &&
      Number(this.newProduct.idMaterial) > 0
    );
  }

  private buildProductRequest(): CreateProductRequest {
    return {
      nombre: this.newProduct.nombre,
      descripcion: this.newProduct.descripcion,
      precio: Number(this.newProduct.precio),
      stock: Number(this.newProduct.stock),
      categoria: { idCategoria: Number(this.newProduct.idCategoria) },
      material: { idMaterial: Number(this.newProduct.idMaterial) },
      estado: true
    };
  }

  private resetForm(): void {
    this.editingProductId = null;
    this.newProduct = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      idCategoria: 0,
      idMaterial: 0
    };
  }
}