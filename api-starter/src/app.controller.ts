import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/role.decorator';
import { RolesGuard } from './auth/role.guard';
import { features } from './common/features';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @Get()
  isAlive() {
    return this.appService.isAlive();
  }

  @Get('features')
  features() {
    return features;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('secured')
  securedNoRole() {
    return { secured: true, noRole: true };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('team@earlymetrics.com')
  @Get('secured-role')
  securedWithRole() {
    return { secured: true };
  }
}
