import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { appConfig, JwtFields } from '../common/app.config';
import { JwtClaims } from '../common/app.model';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly googleService: GoogleService) {
  }

  @Post('create-jwt')
  async createJwtFromGoogleToken(@Body() { token }: { token: string }, @Res() res: Response) {
    const { email, name, locale, domain, picture, subject, roles } =
      await this.googleService.validateGoogleToken(token);
    const jwt = this.authService.createJwt(
      { email, name, locale, domain, subject, roles, picture });
    const cookies = this.authService.makeJwtCookies(jwt);
    for (const cookie of cookies) {
      res.cookie(cookie.name, cookie.value, cookie.options);
    }
    res.json({ jwt });
    // TODO will need a refresh token in HttpOnly cookie for security
  }

  @UseGuards(AuthGuard('jwt')) // A valid JWT is required to generate a new one
  @Post('refresh')
  async refreshJwt(@Req() req: Request, @Res() res: Response) {
    // Standard JWT claims
    const { sub: subject, [JwtFields.jwtNamespace]: { email, name, locale, domain, picture } } = req.user;
    // Custom JWT claims
    const claims = appConfig.jwtNamespace ? req.user[appConfig.jwtNamespace] : req.user;
    // Extract roles from JWT claims
    const { [JwtFields.jwtClaimRoles]: roles } = claims as JwtClaims;
    // Generate a new JWT
    const jwt = this.authService.createJwt(
      { email, name, locale, domain, subject, roles, picture });
    const cookies = this.authService.makeJwtCookies(jwt);
    for (const cookie of cookies) {
      res.cookie(cookie.name, cookie.value, cookie.options);
    }
    return res.json({ jwt });
  }

  @Post('signout')
  async logout(@Res() res: Response): Promise<Response> {
    res.clearCookie(appConfig.jwtPayloadCookieName);
    res.clearCookie(appConfig.jwtSignatureCookieName);
    return res.status(200).json({ signedOut: true });
  }
}
