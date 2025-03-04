import { Global, Module } from '@nestjs/common';

import { AuthService } from '@/api/shared/auth/auth.service';

@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class GlobalModule {}
