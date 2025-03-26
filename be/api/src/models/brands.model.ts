import { Brands } from '@/interfaces/brands.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type BrandsCreationAttributes = Optional<Brands, 'id'>;

export class BrandsModel extends Model<Brands, BrandsCreationAttributes> implements Brands {
  public id: number;
  public name: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof BrandsModel => {
  BrandsModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(225),
      },
    },
    {
      tableName: 'brands',
      timestamps: true,
      sequelize,
    },
  );

  return BrandsModel;
};

export default initModel;
