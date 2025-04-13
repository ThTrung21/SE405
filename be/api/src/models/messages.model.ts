import { Message } from '@/interfaces/message.interface';

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type MessageCreationAttributes = Optional<Message, 'id'>;
export class MessageModel extends Model<Message, MessageCreationAttributes> implements Message {
  public id: number;
  public conversationId: number;
  public senderId: number;
  public productId: number;
  public readonly createdAt!: Date;
}
const initModel = (sequelize: Sequelize): typeof MessageModel => {
  MessageModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      conversationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      senderId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      productId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'messages',
      timestamps: true,
      sequelize,
      paranoid: true,
    },
  );
  return MessageModel;
};

export default initModel;
