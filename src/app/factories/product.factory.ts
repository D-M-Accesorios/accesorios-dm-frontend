import { Product } from '../models/product.model';

export class ProductFactory {
  static fromApi(data: any): Product {
    return {
      id: data.id ?? data.productoId ?? '',
      name: data.nombre ?? data.name ?? 'Producto sin nombre',
      description: data.descripcion ?? data.description ?? '',
      price: Number(data.precio ?? data.price ?? 0),
      stock: Number(data.stock ?? 0),
      imageUrl:
        data.imagenUrl ??
        data.imageUrl ??
        data.urlImagen ??
        'assets/product-placeholder.png',
      category:
        data.categoria?.nombre ??
        data.category ??
        data.categoria ??
        '',
      material:
        data.material?.nombre ??
        data.material ??
        ''
    };
  }

  static fromApiList(data: any[]): Product[] {
    return data.map((item) => this.fromApi(item));
  }
}