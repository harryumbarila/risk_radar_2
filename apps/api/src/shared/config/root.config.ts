import type { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

export const rootConfig = {
  isGlobal: true,
  envFilePath: ['.env.local', '.env.production', '.env'],
  expandVariables: true, // allows us to do VAR_1=hello-${OTHER_VAR}
} as ConfigModuleOptions;
