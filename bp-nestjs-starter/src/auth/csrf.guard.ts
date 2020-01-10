import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { appConfig } from '../common/app.config';

@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly reflector: Reflector = new Reflector();

  canActivate(context: ExecutionContext): boolean {
    const isResource: boolean = this.reflector.get('isResource', context.getHandler());
    if (isResource) {
      return true;
    }
    const { headers } = context.switchToHttp().getRequest<Request>();
    return headers['x-requested-by'] === appConfig.securityRequestedByHeader;
  }
}
