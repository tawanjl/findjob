import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../database/entities/bookmark.entity';
import { Job } from '../database/entities/job.entity';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>,
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ) { }

    async addBookmark(userId: number, jobId: number): Promise<Bookmark> {
        const job = await this.jobRepository.findOne({ where: { id: jobId } });
        if (!job || !job.active) {
            throw new NotFoundException('Job is not available for bookmarking');
        }

        const existing = await this.bookmarkRepository.findOne({
            where: { userId, jobId },
        });

        if (existing) {
            throw new ConflictException('You have already bookmarked this job');
        }

        const bookmark = this.bookmarkRepository.create({ userId, jobId });
        return this.bookmarkRepository.save(bookmark);
    }

    async removeBookmark(userId: number, jobId: number): Promise<void> {
        const result = await this.bookmarkRepository.delete({ userId, jobId });
        if (result.affected === 0) {
            throw new NotFoundException('Bookmark not found');
        }
    }

    async getUserBookmarks(userId: number): Promise<Bookmark[]> {
        return this.bookmarkRepository.find({
            where: { userId },
            relations: ['job', 'job.company'],
            order: { createdAt: 'DESC' },
        });
    }

    // Optional helper if we just want a list of IDs the user bookmarked
    async getBookmarkedJobIds(userId: number): Promise<number[]> {
        const bookmarks = await this.bookmarkRepository.find({
            where: { userId },
            select: ['jobId'],
        });
        return bookmarks.map(b => b.jobId);
    }
}
