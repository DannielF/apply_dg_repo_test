import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mongodb',
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_arch_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
});
