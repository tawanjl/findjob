import { Repository } from 'typeorm';
import { Bookmark } from '../database/entities/bookmark.entity';
import { Job } from '../database/entities/job.entity';
export declare class BookmarkService {
    private readonly bookmarkRepository;
    private readonly jobRepository;
    constructor(bookmarkRepository: Repository<Bookmark>, jobRepository: Repository<Job>);
    addBookmark(userId: number, jobId: number): Promise<Bookmark>;
    removeBookmark(userId: number, jobId: number): Promise<void>;
    getUserBookmarks(userId: number): Promise<Bookmark[]>;
    getBookmarkedJobIds(userId: number): Promise<number[]>;
}
