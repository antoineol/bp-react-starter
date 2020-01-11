import { Args, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Int } from 'type-graphql';
import { AuthorService } from './author.service';
import { Author } from './model/author.model';
import { Post } from './model/post.model';

@Resolver(of => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {
  }

  @Query(returns => Author)
  async author(@Args({ name: 'id', type: () => Int }) id: number): Promise<Author> {
    return this.authorService.findOneById(id);
  }

  @Mutation(returns => Post)
  async upvotePost(@Args({ name: 'postId', type: () => Int }) postId: number): Promise<Post> {
    return this.authorService.upvoteById({ id: postId });
  }

  @ResolveProperty()
  async posts(@Parent() author): Promise<Post[]> {
    const { id } = author;
    return this.authorService.findAllPosts({ authorId: id });
  }
}
