import { Categories } from '@/interfaces/categories.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type CategoriesCreationAttributes = Optional<Categories, 'id'>;

export class CategoriesModel extends Model<Categories, CategoriesCreationAttributes> implements Categories {
  public id: number;
  public name: string;
  public desc: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof CategoriesModel => {
  CategoriesModel.init(
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
      desc: {
        allowNull: false,
        type: DataTypes.STRING(225),
      },
    },
    {
      tableName: 'categories',
      timestamps: true,
      sequelize,
    },
  );

  return CategoriesModel;
};

export default initModel;
