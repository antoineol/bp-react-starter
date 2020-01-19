import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Features {
  @Field(type => Boolean) queryJsonPlaceholder = true;
}
