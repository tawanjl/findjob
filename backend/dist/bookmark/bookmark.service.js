"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookmark_entity_1 = require("../database/entities/bookmark.entity");
const job_entity_1 = require("../database/entities/job.entity");
let BookmarkService = class BookmarkService {
    bookmarkRepository;
    jobRepository;
    constructor(bookmarkRepository, jobRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.jobRepository = jobRepository;
    }
    async addBookmark(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId } });
        if (!job || !job.active) {
            throw new common_1.NotFoundException('Job is not available for bookmarking');
        }
        const existing = await this.bookmarkRepository.findOne({
            where: { userId, jobId },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already bookmarked this job');
        }
        const bookmark = this.bookmarkRepository.create({ userId, jobId });
        return this.bookmarkRepository.save(bookmark);
    }
    async removeBookmark(userId, jobId) {
        const result = await this.bookmarkRepository.delete({ userId, jobId });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Bookmark not found');
        }
    }
    async getUserBookmarks(userId) {
        return this.bookmarkRepository.find({
            where: { userId },
            relations: ['job', 'job.company'],
            order: { createdAt: 'DESC' },
        });
    }
    async getBookmarkedJobIds(userId) {
        const bookmarks = await this.bookmarkRepository.find({
            where: { userId },
            select: ['jobId'],
        });
        return bookmarks.map(b => b.jobId);
    }
};
exports.BookmarkService = BookmarkService;
exports.BookmarkService = BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookmarkService);
//# sourceMappingURL=bookmark.service.js.map