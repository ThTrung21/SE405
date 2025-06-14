import 'reflect-metadata';
import 'dotenv/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, HOST_NAME } from '@config';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { DB } from '@/database';
//
export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }
  public startLogs() {
    logger.info('=================================');
    logger.info(`======= ENV: ${this.env} =======`);
    logger.info(`🚀 App listening on http://${HOST_NAME}:${this.port}`);
    logger.info('=================================');
  }
  // public listen() {
  //   this.app
  //     .listen(this.port, () => {
  //       logger.info(`=================================`);
  //       logger.info(`======= ENV: ${this.env} =======`);
  //       logger.info(`🚀 App listening on http://${HOST_NAME}:${this.port}`);
  //       logger.info(`=================================`);
  //     })
  //     .on('error', err => {
  //       logger.error('Failed to start server:', err);
  //       process.exit(1);
  //     });
  // }

  public getServer() {
    return this.app;
  }
  private connectToDatabase() {
    DB.sequelize
      .sync({ alter: true })
      .then(() => {
        logger.info('Database connected!');
      })
      .catch(err => {
        logger.error('Database connection failed:', err);
        process.exit(1); // Exit the process with an error code
      });
  }
  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    //{ origin: ORIGIN, credentials: CREDENTIALS }
    this.app.use(cors());
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.set('etag', false);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'PetShop e-commerce',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
