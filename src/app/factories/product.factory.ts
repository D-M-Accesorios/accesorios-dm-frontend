export interface Product {
  id?: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export type ProductType = 'collar' | 'pulsera' | 'anillo';

export class ProductFactory {

  static createProduct(type: ProductType): Product {

    switch (type) {
      case 'collar':
        return { name: 'Collar', price: 20000 };

      case 'pulsera':
        return { name: 'Pulsera', price: 15000 };

      case 'anillo':
        return { name: 'Anillo', price: 10000 };

      default:
        throw new Error('Tipo de producto no válido');
    }
  }
}
