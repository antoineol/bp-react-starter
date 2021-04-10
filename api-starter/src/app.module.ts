import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // TypeOrmModule.forRoot({
    //   retryDelay: 3000,
    //   retryAttempts: Number.MAX_VALUE,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {
}
