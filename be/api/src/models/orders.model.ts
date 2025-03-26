import { Order, OrderStatus } from '@/interfaces/orders.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type OrderCreationAttributes = Optional<Order, 'id'>;
export class OrderModel extends Model<Order, OrderCreationAttributes> implements Order {
  public id: number;
  public status: OrderStatus;
  public userId: number;
  public receiptAddress: string;
  public receiptName: string;
  public receiptPhone: string;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof OrderModel => {
  OrderModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        allowNull: false,
        defaultValue: OrderStatus.PENDING,
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      receiptAddress: {
        allowNull: false,
        type: DataTypes.STRING(225),
      },
      receiptName: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      receiptPhone: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return OrderModel;
};

export default initModel;
