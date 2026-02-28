import { Controller, Post, Get, Delete, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookmarkController {
    constructor(private readonly bookmarkService: BookmarkService) { }

    @Roles(UserRole.USER)
    @Post(':jobId')
    addBookmark(@Request() req, @Param('jobId', ParseIntPipe) jobId: number) {
        return this.bookmarkService.addBookmark(req.user.userId, jobId);
    }

    @Roles(UserRole.USER)
    @Delete(':jobId')
    removeBookmark(@Request() req, @Param('jobId', ParseIntPipe) jobId: number) {
        return this.bookmarkService.removeBookmark(req.user.userId, jobId);
    }

    @Roles(UserRole.USER)
    @Get()
    getUserBookmarks(@Request() req) {
        return this.bookmarkService.getUserBookmarks(req.user.userId);
    }

    @Roles(UserRole.USER)
    @Get('ids')
    getBookmarkedJobIds(@Request() req) {
        return this.bookmarkService.getBookmarkedJobIds(req.user.userId);
    }
}
