import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedRequest {
  user?: {
    sub: string;
    email: string;
  };
}

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user;
});
