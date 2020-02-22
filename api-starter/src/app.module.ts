import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { env } from './environment/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      retryDelay: 3000,
      retryAttempts: Number.MAX_VALUE,
    }),
    GraphQLModule.forRoot({
      debug: env.isDev,
      playground: !env.isProd,
      autoSchemaFile: 'schema.graphql',
      introspection: true,
      // buildSchemaOptions
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, AppResolver],
})
export class AppModule {
}
