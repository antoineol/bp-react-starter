import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { appConfig, JwtFields } from '../common/app.config';
import { JwtClaims, ReqUser } from '../common/app.model';
import { Resource } from '../common/resource.decorator';
import { authEndHtml } from './auth-end';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard('google'))
  @Resource()
  @Get('google/signin')
  signIn(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('google'))
  @Resource()
  @Get('google/callback')
  callbackPost(@Body() body: any, @Req() req, @Res() res: Response) {
    const { jwt }: ReqUser = req.user;
    const cookies = this.authService.makeJwtCookies(jwt);
    for (const cookie of cookies) {
      res.cookie(cookie.name, cookie.value, cookie.options);
    }
    // Session was used for oauth2 state only; destroy it at end of sign in.
    req.session.destroy();
    // Respond with an HTML page to close the pop-up
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(authEndHtml));
  }

  @UseGuards(AuthGuard('jwt')) // A valid JWT is required to generate a new one
  @Post('refresh')
  async refreshJwt(@Req() req: Request, @Res() res: Response) {
    // Standard JWT claims
    const { sub: subject, [JwtFields.jwtNamespace]: { email, name, locale, hd } } = req.user;
    // Custom JWT claims
    const claims = appConfig.jwtNamespace ? req.user[appConfig.jwtNamespace] : req.user;
    // Extract roles from JWT claims
    const { [JwtFields.jwtClaimRoles]: roles } = claims as JwtClaims;
    // Generate a new JWT
    const jwt = this.authService.createJwt({ email, name, locale, hd, subject, roles });
    const cookies = this.authService.makeJwtCookies(jwt);
    for (const cookie of cookies) {
      res.cookie(cookie.name, cookie.value, cookie.options);
    }
    return res.status(200).json({ refreshed: true });
  }

  @Post('signout')
  async logout(@Res() res: Response): Promise<Response> {
    res.clearCookie(appConfig.jwtPayloadCookieName);
    res.clearCookie(appConfig.jwtSignatureCookieName);
    return res.status(200).json({ signedOut: true });
  }
}
