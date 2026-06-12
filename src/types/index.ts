export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface ProductSize {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sizes?: ProductSize[];
  categoryId: string;
  imageUrl: string;
  featured: boolean;
  order: number;
}

export interface MenuData {
  categories: Category[];
  products: Product[];
}

export interface StoreSettings {
  name: string;
  description: string;
  logoUrl: string;
}
