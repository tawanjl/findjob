import { BookmarkService } from './bookmark.service';
export declare class BookmarkController {
    private readonly bookmarkService;
    constructor(bookmarkService: BookmarkService);
    addBookmark(req: any, jobId: number): Promise<import("../database/entities/bookmark.entity").Bookmark>;
    removeBookmark(req: any, jobId: number): Promise<void>;
    getUserBookmarks(req: any): Promise<import("../database/entities/bookmark.entity").Bookmark[]>;
    getBookmarkedJobIds(req: any): Promise<number[]>;
}
