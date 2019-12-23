import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/role.decorator';
import { RolesGuard } from './auth/role.guard';
import { User } from './user/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  isAlive(): string {
    return this.appService.isAlive();
  }

  @Get('db')
  async db(): Promise<{ description: string, user: User }> {
    return {
      description: 'User inserted, returned and deleted.',
      user: await this.appService.testDb(),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('secured1')
  securedNoRole() {
    return { secured: true, noRole: true };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('secured')
  secured() {
    return { secured: true };
  }
}
