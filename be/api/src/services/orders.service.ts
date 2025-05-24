import { Service } from 'typedi';
import { DB } from '@/database';
import { CreateOrderDto, UpdateOrderDto } from '@/dtos/orders.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Order } from '@interfaces/orders.interface';
import { OrderItem } from '@/interfaces/order-items.interface';

@Service()
export class OrderService {
  public async isOrderBelongsToUser(orderId: number, userId: number): Promise<boolean> {
    const order: Order = await DB.Order.findByPk(orderId);
    if (!order) throw new HttpException(409, "Order doesn't exist");

    return order.userId === userId;
  }

  public async findAllOrders(): Promise<Order[]> {
    const allOrders: Order[] = await DB.Order.findAll({
      include: [DB.OrderItem],
      // attributes: { exclude: ['userId'] },
    });
    return allOrders;
  }

  public async findAllOrdersByUserId(userId: number): Promise<Order[]> {
    const allOrders: Order[] = await DB.Order.findAll({
      where: {
        userId,
      },
      include: [DB.OrderItem],
    });
    return allOrders;
  }

  public async findOrderById(orderId: number): Promise<Order> {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");

    return findOrder;
  }

  public async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    const t = await DB.sequelize.transaction();
    try {
      const { products, ...rest } = dto;
      const createdOrder: Order = await DB.Order.create(
        {
          ...rest,
          userId,
        },
        { transaction: t },
      );

      const orderItems: OrderItem[] = await Promise.all(
        products.map(async item => {
          const product = await DB.Product.findByPk(item.productId, {
            transaction: t,
          });

          await product.decrement('stock', { by: item.quantity, transaction: t });
          await product.increment('sold', { by: item.quantity, transaction: t });

          return {
            productId: item.productId,
            orderId: createdOrder.id,
            quantity: item.quantity,
            sumPrice: item.quantity * product.price,
          };
        }),
      );

      await DB.OrderItem.bulkCreate(orderItems, { transaction: t });
      await t.commit();
      return createdOrder;
    } catch (error) {
      await t.rollback();
      console.log(error);
      throw error;
    }
  }

  public async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<Order> {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");

    await DB.Order.update(dto, { where: { id: orderId } });

    const updatedOrder: Order = await DB.Order.findByPk(orderId);
    return updatedOrder;
  }

  // public async deleteOrder(orderId: number): Promise<Order> {
  //   const findOrder: Order = await DB.Order.findByPk(orderId);
  //   if (!findOrder) throw new HttpException(409, "Order doesn't exist");

  //   await DB.Order.destroy({ where: { id: orderId } });

  //   return findOrder;
  // }

  public async deleteOrder(orderId: number): Promise<void> {
    try {
      const findOrder: Order = await DB.Order.findByPk(orderId);

      if (!findOrder) {
        throw new Error(`Order with ID ${orderId} not found.`);
      }

      await DB.sequelize.transaction(async t => {
        const orderItems = await DB.OrderItem.findAll({
          where: {
            orderId: findOrder.id,
          },
          transaction: t,
        });

        await Promise.all(
          orderItems.map(async orderItem => {
            const product = await DB.Product.findByPk(orderItem.productId, {
              transaction: t,
            });

            await product.increment('stock', {
              by: orderItem.quantity,
              transaction: t,
            });

            await product.decrement('sold', {
              by: orderItem.quantity,
              transaction: t,
            });
          }),
        );

        await DB.OrderItem.destroy({
          where: {
            orderId: findOrder.id,
          },
          transaction: t,
        });

        await DB.Order.destroy({ where: { id: orderId } });
        return findOrder;
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
