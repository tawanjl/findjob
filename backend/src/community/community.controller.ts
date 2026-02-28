import {
    Controller, Get, Post, Delete,
    Param, Body, Request, UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    // ── Posts ─────────────────────────────────────────────────────────────────

    @Get('posts')
    findAllPosts() {
        return this.communityService.findAllPosts();
    }

    @Get('posts/:id')
    findOnePost(@Param('id') id: string) {
        return this.communityService.findOnePost(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('posts')
    createPost(@Request() req, @Body() body: { title: string; content: string }) {
        return this.communityService.createPost(req.user.userId, body.title, body.content);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('posts/:id')
    deletePost(@Request() req, @Param('id') id: string) {
        return this.communityService.deletePost(+id, req.user.userId);
    }

    // ── Comments ──────────────────────────────────────────────────────────────

    @UseGuards(JwtAuthGuard)
    @Post('posts/:postId/comments')
    createComment(
        @Request() req,
        @Param('postId') postId: string,
        @Body() body: { content: string },
    ) {
        return this.communityService.createComment(+postId, req.user.userId, body.content);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('comments/:id')
    deleteComment(@Request() req, @Param('id') id: string) {
        return this.communityService.deleteComment(+id, req.user.userId);
    }
}
