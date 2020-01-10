import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user/interfaces/user.dto';
import { User } from './user/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  isAlive(arg?: any): { isAlive: true, arg?: any } {
    return { isAlive: true, arg };
  }

  async testDb(): Promise<User> {
    const userDto: UserDto = { name: 'Antoine OL', email: 'antoine_ol@earlymetrics.com', roles: ['admin'] };
    const id: string = (await this.userRepository.insert(userDto)).identifiers[0].id;
    const user = await this.userRepository.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }
}
