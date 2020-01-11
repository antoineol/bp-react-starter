import { Injectable } from '@nestjs/common';
import { Author } from './model/author.model';
import { Post } from './model/post.model';

export type PostDb = Post & { authorId: number };

const posts: PostDb[] = [
  { id: 1, title: 'My life', votes: 3, authorId: 1 },
  { id: 2, title: 'Titanic', votes: 2, authorId: 1 },
  { id: 3, title: 'My beauty', votes: 5, authorId: 2 },
];

const authors: Author[] = [
  {
    id: 1, firstName: 'John', lastName: 'Doe', posts: [
      posts[0],
      posts[1],
    ],
  },
  {
    id: 2, firstName: 'Jane', lastName: 'Johnson', posts: [
      posts[2],
    ],
  },
];

@Injectable()
export class AuthorService {
  findOneById(id: number): Author {
    return authors.find(author => author.id === id);
  }

  async findAllPosts({ authorId }: { authorId: number }): Promise<Post[]> {
    return posts.filter(post => post.authorId === authorId);
  }

  async upvoteById({ id }: { id: number }): Promise<Post> {
    const post = posts.find(post => post.id === id);
    if (!post.votes) {
      post.votes = 0;
    }
    post.votes++;
    return post;
  }
}
