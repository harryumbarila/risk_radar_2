import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionOptions } from './connection-options';

const nestjsModuleOptions: TypeOrmModuleOptions = {
  name: 'example-name',
  ...connectionOptions,
};

export const DbTypeORMModule = TypeOrmModule.forRoot(nestjsModuleOptions);
