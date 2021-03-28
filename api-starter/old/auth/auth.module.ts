import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '../common/app.config';
import { env } from '../environment/env';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // JwtModule.register({
    //   // May be replaced with PEM to be safer in production
    //   secret: env.secretKey,
    //   signOptions: {
    //     expiresIn: appConfig.jwtLifeTime,
    //     algorithm: appConfig.jwtAlgorithm,
    //     // algorithm to move to RSA / PEM
    //     issuer: appConfig.jwtIssuer,
    //   },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleService, JwtStrategy, Logger],
})
export class AuthModule {
}
