import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  isAlive(): string {
    return 'I\'m alive!';
  }

  testDb(): void {
    // TODO create a user in DB, return it and delete it in DB
  }
}
