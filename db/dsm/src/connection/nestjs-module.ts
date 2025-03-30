import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionOptions } from './connection-options';

const nestjsModuleOptions: TypeOrmModuleOptions = {
  name: 'dsm',
  ...connectionOptions,
};

export const DbTypeORMModule = TypeOrmModule.forRoot(nestjsModuleOptions);
