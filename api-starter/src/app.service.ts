import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  isAlive(arg?: any): { isAlive: true, arg?: any } {
    return { isAlive: true, arg };
  }
}
