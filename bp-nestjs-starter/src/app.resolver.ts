import { Query, Resolver } from '@nestjs/graphql';
import { Features } from '../model/features.model';

@Resolver()
export class AppResolver {

  @Query(returns => Features)
  features() {
    return new Features();
  }
}
