export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  importPrice: number;
  brandId: number;
  categoryId: number;
  inventory: number;
  sold: number;
  images: string[];
}
