import { CommunityService } from './community.service';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    findAllPosts(): Promise<import("../database/entities/post.entity").Post[]>;
    findOnePost(id: string): Promise<import("../database/entities/post.entity").Post>;
    createPost(req: any, body: {
        title: string;
        content: string;
    }): Promise<import("../database/entities/post.entity").Post>;
    deletePost(req: any, id: string): Promise<void>;
    createComment(req: any, postId: string, body: {
        content: string;
    }): Promise<import("../database/entities/comment.entity").Comment>;
    deleteComment(req: any, id: string): Promise<void>;
}
