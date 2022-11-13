import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: Number(process.env.RDS_PORT) || 3306,
  host: process.env.RDS_HOST,
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  entities: [path.join(__dirname, '../..', '/**/*.entity{.ts,.js}')],
  logging: process.env.NODE_ENV === 'e2e' ? ['info', 'log'] : 'all',
  synchronize: false, // Don't use it on production, It will sync entity and modify your database to match with entity
};
export default dbConfig;
