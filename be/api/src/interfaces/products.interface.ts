export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  importPrice: number;
  brandId: number;
  categoryId: number;
  stock: number;
  sold: number;
  images: string[];
  //number of favorite
  score: number;
}
