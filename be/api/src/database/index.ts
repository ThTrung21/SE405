/* eslint-disable prettier/prettier */

import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_DATABASE, DB_PASS } from '@config';

import { logger } from '@/utils/logger';

import BrandsModel from '@/models/brands.model';
import CategoriesModel from '@/models/categories.model';
import ConversationModel from '@/models/conversations.model';
import MessageModel from '@/models/messages.model';
import OrderItemModel from '@/models/order-items.model';
import OrderModel from '@/models/orders.model';
import ProductModel from '@/models/products.model';
import ReviewsModel from '@/models/reviews.model';
import UserModel from '@/models/users.model';
import Sequelize from 'sequelize';

// console.log({ DB_DATABASE, DB_USER, DB_PASSWORD, DB_PASS });

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  timezone: '+07:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },

  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
  attributeBehavior: 'unsafe-legacy',

  // dialectOptions: {
  //   ssl: {
  //     ca: readFileSync(join(__dirname, 'DigiCertGlobalRootCA.crt.pem')).toString(),
  //   },
  // },
});
sequelize.authenticate();

const initAllModels = (sequelize: Sequelize.Sequelize) => {
  const OrderItem = OrderItemModel(sequelize);
  const Product = ProductModel(sequelize);
  const Categories = CategoriesModel(sequelize);
  const Order = OrderModel(sequelize);
  const User = UserModel(sequelize);
  const Brands = BrandsModel(sequelize);
  const Message = MessageModel(sequelize);
  const Conversation = ConversationModel(sequelize);
  const Review = ReviewsModel(sequelize);

  //table relations
  Order.hasMany(OrderItem, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  //brands and products
  Brands.hasMany(Product, { foreignKey: 'brandId' });
  Product.belongsTo(Brands, { foreignKey: 'brandId' });

  //categories and products
  Categories.hasMany(Product, { foreignKey: 'categoryId' });
  Product.belongsTo(Categories, { foreignKey: 'categoryId' });

  //products and an order_item
  Product.hasMany(OrderItem, { foreignKey: 'productId' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });

  //users and orders
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User, { foreignKey: 'userId' });

  //review and products
  Product.hasMany(Review, { foreignKey: 'productId' });
  Review.belongsTo(Product, { foreignKey: 'productId' });

  //review and user
  User.hasMany(Review, { foreignKey: 'userId' });
  Review.belongsTo(User, { foreignKey: 'userId' });

  // Conversations and Users (customer and staff) and Orders
  User.hasMany(Conversation, { foreignKey: 'userId', as: 'customerConversations' });
  Conversation.belongsTo(User, { foreignKey: 'userId', as: 'customer' });

  User.hasMany(Conversation, { foreignKey: 'staffId', as: 'staffConversations' });
  Conversation.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });

  Order.hasMany(Conversation, { foreignKey: 'orderId' });
  Conversation.belongsTo(Order, { foreignKey: 'orderId' });

  // Messages and Conversations
  Conversation.hasMany(Message, { foreignKey: 'conversationId' });
  Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
  // Messages and Users (sender)
  User.hasMany(Message, { foreignKey: 'senderId' });
  Message.belongsTo(User, { foreignKey: 'senderId' });
  //Messages and Products (optional)
  Product.hasMany(Message, { foreignKey: 'productId' });
  Message.belongsTo(Product, { foreignKey: 'productId' });

  return {
    OrderItem,
    Product,
    Categories,
    Order,
    User,
    Brands,
    Message,
    Conversation,
    Review,
  };
};

export const DB = {
  ...initAllModels(sequelize),
  sequelize,
  Sequelize,
};
