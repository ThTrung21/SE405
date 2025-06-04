import { DB } from '@/database';
import { Service } from 'typedi';

@Service()
export class BrandService {
  public async getBrands() {
    const { Brands } = DB;
    const brands = await Brands.findAll();
    return brands;
  }

  public async createBrand(brand: { id: number; name: string }) {
    const { Brands } = DB;
    const createdBrand = await Brands.create({
      id: brand.id,
      name: brand.name,
    });
    return createdBrand;
  }
}
