import { Repository } from 'typeorm';
import { Post } from '../database/entities/post.entity';
import { Comment } from '../database/entities/comment.entity';
export declare class CommunityService {
    private readonly postRepository;
    private readonly commentRepository;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>);
    findAllPosts(): Promise<Post[]>;
    findOnePost(id: number): Promise<Post>;
    createPost(userId: number, title: string, content: string): Promise<Post>;
    deletePost(id: number, userId: number): Promise<void>;
    createComment(postId: number, userId: number, content: string): Promise<Comment>;
    deleteComment(id: number, userId: number): Promise<void>;
}
