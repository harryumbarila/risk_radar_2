import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionOptions } from './connection-options';

export const nestjsModuleOptions: TypeOrmModuleOptions = {
  name: 'finance',
  ...connectionOptions,
};

export const DbTypeORMModule = TypeOrmModule.forRoot(nestjsModuleOptions);
