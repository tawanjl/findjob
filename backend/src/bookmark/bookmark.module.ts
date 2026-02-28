import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from '../database/entities/bookmark.entity';
import { Job } from '../database/entities/job.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Bookmark, Job])],
    controllers: [BookmarkController],
    providers: [BookmarkService],
})
export class BookmarkModule { }
