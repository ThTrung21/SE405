import { App } from '@/app';
import dotenv from 'dotenv';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { ProductRoute } from '@routes/products.route';
import { OrderRoute } from './routes/orders.route';
import { initWebSocket } from './http/websocket';
import { CategoryRoute } from './routes/categories.route';
import { OrderItemRoute } from './routes/order-items.route';
// import { GeneralRoute } from './routes/general.route';
import { BrandRoute } from './routes/brands.route';
import { ChatRoute } from './routes/chat.route';
import http from 'http';

dotenv.config();
ValidateEnv();
const appInstance = new App([
  new AuthRoute(),
  new UserRoute(),
  new ProductRoute(),
  new OrderRoute(),
  new CategoryRoute(),
  new OrderItemRoute(),
  // new GeneralRoute(),
  new BrandRoute(),
  new ChatRoute(),
]);
const expressApp = appInstance.getServer();
const server = http.createServer(expressApp);

// 🔌 Initialize WebSocket
initWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  appInstance.startLogs();
});
