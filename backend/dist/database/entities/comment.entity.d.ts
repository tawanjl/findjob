import { User } from './user.entity';
import { Post } from './post.entity';
export declare class Comment {
    id: number;
    content: string;
    postId: number;
    userId: number;
    post: Post;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
