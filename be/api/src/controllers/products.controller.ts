import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateProductDto } from '@/dtos/products.dto';
import { Product } from '@interfaces/products.interface';
import { ProductService } from '@services/products.service';

export class ProductController {
  public product = Container.get(ProductService);

  public getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProductsData: Product[] = await this.product.findAllProducts();

      res.status(200).json({ data: findAllProductsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTenProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findTenProductsData: Product[] = await this.product.findFirstTenProducts();

      res.status(200).json({ data: findTenProductsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.id);
      const findOneProductData: Product = await this.product.findProductById(productId);

      res.status(200).json({ data: findOneProductData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };
  public getProductsByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid input, expected an array of IDs' });
      }
      const findProductsData: Product[] = await this.product.findProductsByIds(ids);

      res.status(200).json({ data: findProductsData, message: 'findMany' });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productData: CreateProductDto = req.body;
      const createProductData: Product = await this.product.createProduct(productData);

      res.status(201).json({ data: createProductData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.id);
      const productData: CreateProductDto = req.body;
      const updateProductData: Product = await this.product.updateProduct(productId, productData);

      res.status(200).json({ data: updateProductData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.id);
      const deleteProductData: Product = await this.product.deleteProduct(productId);

      res.status(200).json({ data: deleteProductData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public searchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { keyword } = req.query;
      const searchProductsData: Product[] = await this.product.searchProductByName(keyword as string);

      res.status(200).json({ data: searchProductsData, message: 'search' });
    } catch (error) {
      next(error);
    }
  };
}
