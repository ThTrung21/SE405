import { ChatStatus, ChatType, Conversation } from '@/interfaces/conversation.interface';

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type ConversationCreationAttributes = Optional<Conversation, 'id'>;
export class ConversationModel extends Model<Conversation, ConversationCreationAttributes> implements Conversation {
  public id: number;

  public userId: number;
  public staffId: number;
  public orderId: number;
  public type: ChatType;
  public status: ChatStatus;
  public expiresAt: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
const initModel = (sequelize: Sequelize): typeof ConversationModel => {
  ConversationModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      orderId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      staffId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM(...Object.values(ChatType)),
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM(...Object.values(ChatStatus)),
        defaultValue: ChatStatus.PENDING,
      },
      expiresAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'conversations',
      timestamps: true,
      sequelize,
      paranoid: true,
    },
  );
  return ConversationModel;
};

export default initModel;
