import { Router } from 'express';
import { OrderItemController } from '@/controllers/order-items.controller';
import { CreateOrderItemDto } from '@/dtos/order-items.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminCheckMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';

export class OrderItemRoute implements Routes {
  public path = '/order-items';
  public router = Router();
  public orderItem = new OrderItemController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.orderItem.getOrdersItem);
    this.router.get(`${this.path}/:id(\\d+)`, AuthMiddleware, this.orderItem.getOrderItemById);
    this.router.post(`${this.path}`, AuthMiddleware, AdminCheckMiddleware, ValidationMiddleware(CreateOrderItemDto), this.orderItem.createOrderItem);
  }
}
