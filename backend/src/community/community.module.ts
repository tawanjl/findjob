import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Post } from '../database/entities/post.entity';
import { Comment } from '../database/entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Post, Comment])],
    controllers: [CommunityController],
    providers: [CommunityService],
})
export class CommunityModule { }
