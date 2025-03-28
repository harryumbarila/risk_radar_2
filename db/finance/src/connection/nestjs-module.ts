import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionOptions } from './connection-options';

const nestjsModuleOptions: TypeOrmModuleOptions = {
  ...connectionOptions,
};

export const DbTypeORMModule = TypeOrmModule.forRoot(nestjsModuleOptions);
