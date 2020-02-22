import { Module } from '@nestjs/common';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';

@Module({
  providers: [AuthorService, AuthorResolver],
})
export class AuthorsModule {
}
