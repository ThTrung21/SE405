import { Router } from 'express';
import { ProductController } from '@/controllers/products.controller';
import { CreateProductDto } from '@/dtos/products.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminCheckMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';

export class ProductRoute implements Routes {
  public path = '/products';
  public router = Router();
  public product = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.product.getProducts);
    this.router.get(`${this.path}/ten`, this.product.getTenProducts);
    this.router.get(`${this.path}/search`, this.product.searchProducts);
    this.router.get(`${this.path}/:id(\\d+)`, this.product.getProductById);
    this.router.get(`${this.path}/filtered/:id(\\d+)`, this.product.getProductByCategory);
    this.router.post(`${this.path}/getByIds`, this.product.getProductsByIds);
    this.router.post(`${this.path}`, AuthMiddleware, AdminCheckMiddleware, ValidationMiddleware(CreateProductDto), this.product.createProduct);
    this.router.put(
      `${this.path}/:id(\\d+)`,
      AuthMiddleware,
      AdminCheckMiddleware,
      ValidationMiddleware(CreateProductDto, true),
      this.product.updateProduct,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware, AdminCheckMiddleware, this.product.deleteProduct);
  }
}
