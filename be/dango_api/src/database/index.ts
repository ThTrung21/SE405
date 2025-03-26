/* eslint-disable prettier/prettier */
const { Sequelize } = require('sequelize');
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PASS } from '@config';

import { logger } from '@/utils/logger';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log({ DB_DATABASE, DB_USER, DB_PASSWORD, DB_PASS });

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

  dialectOptions: {
    ssl: {
      ca: readFileSync(join(__dirname, 'DigiCertGlobalRootCA.crt.pem')).toString(),
    },
  },
});
sequelize.authenticate();
