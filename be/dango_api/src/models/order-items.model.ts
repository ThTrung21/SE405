import { OrderItem } from '@/interfaces/order-items.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type OrderItemCreationAttributes = Optional<OrderItem, 'id'>;

export class OrderItemModel extends Model<OrderItem, OrderItemCreationAttributes> implements OrderItem {
  public id: number;
  public quantity: number;
  public productId: number;
  public orderId: number;
  public sumPrice: number;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof OrderItemModel => {
  OrderItemModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      orderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sumPrice: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      tableName: 'order_items',
      timestamps: true,
      sequelize,
    },
  );

  return OrderItemModel;
};

export default initModel;
