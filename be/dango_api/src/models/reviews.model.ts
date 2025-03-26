import { Reviews } from '@/interfaces/reviews.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type ReviewsCreationAttributes = Optional<Reviews, 'id'>;

export class ReviewsModel extends Model<Reviews, ReviewsCreationAttributes> implements Reviews {
  public id: number;
  public userId: number;
  public content: string;
  public rating: number;
  public productId: number;

  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
}

const initModel = (sequelize: Sequelize): typeof ReviewsModel => {
  ReviewsModel.init(
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING(225),
      },
      rating: {
        allowNull: false,
        type: DataTypes.DOUBLE,
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'reviews',
      timestamps: true,
      sequelize,
    },
  );

  return ReviewsModel;
};

export default initModel;
