import { DB } from '@/database';
import { Service } from 'typedi';

@Service()
export class BrandService {
  public async getBrands() {
    const { Brands } = DB;
    const brands = await Brands.findAll();
    return brands;
  }

  public async createBrand(name: string) {
    const { Brands } = DB;
    const brand = await Brands.create({ name });
    return brand;
  }
}
