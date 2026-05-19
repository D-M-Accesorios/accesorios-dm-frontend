import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product.model';
import { Category, Material, ProductService } from '../../services/product.service';

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
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  selectedImageFile: File | null = null;
  previewImage = '';

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
  this.isLoading = true;

  this.productService.getProducts().subscribe({
    next: (products) => {
      this.products = products;
      this.isLoading = false;

      this.products.forEach((product, index) => {
        this.productService.getProductById(product.id).subscribe({
          next: (detail) => {
            if (!detail) return;

            this.products[index] = {
              ...this.products[index],
              stock: detail.stock,
              material: detail.material,
              category: detail.category,
              description: detail.description
            };
          }
        });
      });
    },
    error: () => {
      this.errorMessage = 'No fue posible cargar los productos.';
      this.isLoading = false;
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    this.selectedImageFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  saveProduct(): void {
    this.clearMessages();

    if (!this.isFormValid()) {
      this.errorMessage = 'Completa todos los campos obligatorios.';
      return;
    }

    const product = this.buildProductRequest();

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, product).subscribe({
        next: () => {
          if (this.selectedImageFile) {
            this.uploadImageAndFinish(this.editingProductId!, 'Producto actualizado correctamente.');
            return;
          }

          this.successMessage = 'Producto actualizado correctamente.';
          this.resetForm();
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error actualizando producto:', error);
          this.errorMessage = 'No fue posible actualizar el producto.';
        }
      });

      return;
    }

    this.productService.createProduct(product).subscribe({
      next: (response: any) => {
        const productId = String(response.idProducto ?? response.id ?? '');

        if (this.selectedImageFile && productId) {
          this.uploadImageAndFinish(productId, 'Producto creado correctamente.');
          return;
        }

        this.successMessage = 'Producto creado correctamente.';
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error creando producto:', error);
        this.errorMessage = 'No fue posible crear el producto.';
      }
    });
  }
editProduct(product: Product): void {
  this.clearMessages();

  this.productService.getProductById(product.id).subscribe({
    next: (detail: Product | null) => {
      if (!detail) return;

      this.editingProductId = detail.id;

      this.newProduct = {
        nombre: detail.name,
        descripcion: detail.description,
        precio: Number(detail.price),
        stock: Number(detail.stock),
        idCategoria: this.getCategoryIdByName(detail.category),
        idMaterial: this.getMaterialIdByName(detail.material)
      };

      this.previewImage = detail.imageUrl;
      this.selectedImageFile = null;

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    error: (error) => {
      console.error('Error cargando producto:', error);
      this.errorMessage = 'No fue posible cargar el producto para edición.';
    }
  });
}
  deleteProduct(product: Product): void {
    const confirmDelete = confirm(`¿Eliminar el producto "${product.name}"?`);

    if (!confirmDelete) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.successMessage = 'Producto eliminado correctamente.';
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error eliminando producto:', error);
        this.errorMessage = 'No fue posible eliminar el producto.';
      }
    });
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  private buildProductRequest() {
    return {
      nombre: this.newProduct.nombre,
      descripcion: this.newProduct.descripcion,
      precio: Number(this.newProduct.precio),
      stock: Number(this.newProduct.stock),
      categoria: {
        idCategoria: Number(this.newProduct.idCategoria)
      },
      material: {
        idMaterial: Number(this.newProduct.idMaterial)
      },
      estado: true
    };
  }

  private uploadImageAndFinish(productId: string, message: string): void {
    if (!this.selectedImageFile) {
      return;
    }

    this.productService.uploadProductImage(productId, this.selectedImageFile).subscribe({
      next: () => {
        this.successMessage = message;
        this.resetForm();
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error subiendo imagen:', error);
        this.errorMessage = 'El producto se guardó, pero la imagen no pudo subirse.';
        this.loadProducts();
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
private getCategoryIdByName(categoryName?: string): number {
  const category = this.categories.find(
    (item) => item.nombre === categoryName
  );

  return category?.idCategoria ?? 0;
}

private getMaterialIdByName(materialName?: string): number {
  const material = this.materials.find(
    (item) => item.nombre === materialName
  );

  return material?.idMaterial ?? 0;
}
  private resetForm(): void {
    this.editingProductId = null;
    this.selectedImageFile = null;
    this.previewImage = '';

    this.newProduct = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      idCategoria: 0,
      idMaterial: 0
    };
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}