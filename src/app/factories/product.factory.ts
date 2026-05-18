import { Product } from '../models/product.model';

export class ProductFactory {
  static fromApi(data: any): Product {
    return {
      id: String(
        data.id ??
        data.productoId ??
        data.productId ??
        data.idProducto ??
        ''
      ),

      name:
        data.nombre ??
        data.name ??
        'Producto sin nombre',

      description:
        data.descripcion ??
        data.description ??
        '',

      price: Number(
        data.precio ??
        data.price ??
        0
      ),

      stock: Number(
        data.stock ??
        0
      ),

    imageUrl:
  data.imagenPrincipal
    ? `http://localhost:8001/api/v1${data.imagenPrincipal}`
    : data.imagenes?.[0]?.urlImagen
      ? `http://localhost:8001/api/v1${data.imagenes[0].urlImagen}`
      : 'https://placehold.co/300x200?text=Producto',

      category:
        data.categoria?.nombre ??
        data.categoriaNombre ??
        data.category ??
        data.categoria ??
        '',

      material:
        data.material?.nombre ??
        data.materialNombre ??
        data.material ??
        ''
    };
  }

  static fromApiList(data: any[]): Product[] {
    return data.map((item) => this.fromApi(item));
  }
}