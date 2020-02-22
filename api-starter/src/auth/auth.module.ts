import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { appConfig } from '../common/app.config';
import { env } from '../environment/env';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'google',
      // Only show accounts that match the hosted domain.
      hd: appConfig.authorizedDomain,
      // Ensure the user can always select an account when sent to Google.
      prompt: 'select_account',
    }),
    JwtModule.register({
      // May be replaced with PEM to be safer in production
      secret: env.secretKey,
      signOptions: {
        expiresIn: appConfig.jwtLifeTime,
        algorithm: appConfig.jwtAlgorithm,
        // algorithm to move to RSA / PEM
        issuer: appConfig.jwtIssuer,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleService, JwtStrategy, Logger],
})
export class AuthModule {
}
