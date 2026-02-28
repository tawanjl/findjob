import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../database/entities/post.entity';
import { Comment } from '../database/entities/comment.entity';

@Injectable()
export class CommunityService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) { }

    async findAllPosts(): Promise<Post[]> {
        return this.postRepository.find({
            relations: ['user', 'comments'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOnePost(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'comments', 'comments.user'],
        });
        if (!post) throw new NotFoundException('Post not found');
        return post;
    }

    async createPost(userId: number, title: string, content: string): Promise<Post> {
        const post = this.postRepository.create({ userId, title, content });
        return this.postRepository.save(post);
    }

    async deletePost(id: number, userId: number): Promise<void> {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId) throw new UnauthorizedException('You can only delete your own posts');
        await this.postRepository.remove(post);
    }

    async createComment(postId: number, userId: number, content: string): Promise<Comment> {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');
        const comment = this.commentRepository.create({ postId, userId, content });
        return this.commentRepository.save(comment);
    }

    async deleteComment(id: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.userId !== userId) throw new UnauthorizedException('You can only delete your own comments');
        await this.commentRepository.remove(comment);
    }
}
