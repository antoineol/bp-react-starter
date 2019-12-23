import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Profile } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

interface ReqUser {
  accessToken: string;
  profile: Profile;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/signin')
  async signIn(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async callbackPost(@Body() body: any, @Req() req, @Res() res: Response): Promise<Response> {
    const { accessToken, profile }: ReqUser = req.user;
    const cookies = this.authService.makeJwtCookies(accessToken);
    for (const cookie of cookies) {
      res.cookie(cookie.name, cookie.value, cookie.options);
    }
    return res.json({ expiresIn: cookies[0].options.maxAge, profile });
  }

  @UseGuards()
  @Get('google/groups')
  async userGroups() {
    return { group: true };
  }

  // @Post('jwt/refresh')
  // async refreshJwt(@Req() req: Request): Promise<{ access: string }> {
  //   const access = await this.authService.checkRefreshToken(req.cookies[REFRESH_TOKEN] as string);
  //
  //   return { access };
  // }
  //
  // @Post('jwt/logout')
  // async logout(@Res() res: Response): Promise<Response> {
  //   res.clearCookie(REFRESH_TOKEN);
  //   return res.sendStatus(200);
  // }
}
