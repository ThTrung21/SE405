import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Product } from '@/interfaces/products.interface';

export type ProductCreationAttributes = Optional<Product, 'id'>;

export class ProductModel extends Model<Product, ProductCreationAttributes> implements Product {
  public id: number;
  public name: string;
  public desc: string;
  public price: number;
  public brandId: number;
  public importPrice: number;
  public categoryId: number;
  public inventory: number;
  public sold: number;
  public images: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof ProductModel => {
  ProductModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      desc: {
        allowNull: false,
        type: DataTypes.STRING(225),
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
      importPrice: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
      brandId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      categoryId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      inventory: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sold: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      images: {
        allowNull: true,
        type: DataTypes.JSON,
      },
    },
    {
      tableName: 'products',
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return ProductModel;
};

export default initModel;
