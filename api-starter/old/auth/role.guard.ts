import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    // TODO should re-implement role management
    const { user } = context.switchToHttp().getRequest<{ user: any/*User*/ | null }>();

    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some(role => roles.includes(role));
  }
}
