import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionOptions } from './connection-options';

export const nestjsModuleOptions: TypeOrmModuleOptions = {
  name: 'crescent-view',
  ...connectionOptions,
};

export const DbTypeORMModule = TypeOrmModule.forRoot(nestjsModuleOptions);
