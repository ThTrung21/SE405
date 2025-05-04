import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateOrderItemDto } from '@/dtos/order-items.dto';
import { OrderItem } from '@interfaces/order-items.interface';
import { OrderItemService } from '@/services/order-items.service';

export class OrderItemController {
  public order = Container.get(OrderItemService);

  public getOrdersItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllOrdersItemData: OrderItem[] = await this.order.findAllOrdersItem();

      res.status(200).json({ data: findAllOrdersItemData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getOrderItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderItemId = Number(req.params.id);
      const findOneOrderItemData: OrderItem = await this.order.findOrderItemById(orderItemId);

      res.status(200).json({ data: findOneOrderItemData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderItemData: CreateOrderItemDto = req.body;
      const createOrderItemData: OrderItem = await this.order.createOrderItem(orderItemData);

      res.status(201).json({ data: createOrderItemData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderItemId = Number(req.params.id);
      const orderItemData: CreateOrderItemDto = req.body;
      const updateOrderItem: OrderItem = await this.order.updateOrderItem(orderItemId, orderItemData);

      res.status(200).json({ data: updateOrderItem, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderItemId = Number(req.params.id);
      const deleteOrderItemData: OrderItem = await this.order.deleteOrder(orderItemId);

      res.status(200).json({ data: deleteOrderItemData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
