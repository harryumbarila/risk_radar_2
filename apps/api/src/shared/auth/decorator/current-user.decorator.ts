import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // eslint-disable-next-line
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line
    if (request.userEntity) {
      // eslint-disable-next-line
      return request.userEntity;
    }

    return null;
  }
);
