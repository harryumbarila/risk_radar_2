import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
     
    const request = context.switchToHttp().getRequest();

     
    if (request.userEntity) {
       
      return request.userEntity;
    }

    return null;
  }
);
