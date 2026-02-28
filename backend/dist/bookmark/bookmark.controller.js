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
exports.BookmarkController = void 0;
const common_1 = require("@nestjs/common");
const bookmark_service_1 = require("./bookmark.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const user_entity_1 = require("../database/entities/user.entity");
let BookmarkController = class BookmarkController {
    bookmarkService;
    constructor(bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    addBookmark(req, jobId) {
        return this.bookmarkService.addBookmark(req.user.userId, jobId);
    }
    removeBookmark(req, jobId) {
        return this.bookmarkService.removeBookmark(req.user.userId, jobId);
    }
    getUserBookmarks(req) {
        return this.bookmarkService.getUserBookmarks(req.user.userId);
    }
    getBookmarkedJobIds(req) {
        return this.bookmarkService.getBookmarkedJobIds(req.user.userId);
    }
};
exports.BookmarkController = BookmarkController;
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, common_1.Post)(':jobId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "addBookmark", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, common_1.Delete)(':jobId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('jobId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "removeBookmark", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "getUserBookmarks", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, common_1.Get)('ids'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookmarkController.prototype, "getBookmarkedJobIds", null);
exports.BookmarkController = BookmarkController = __decorate([
    (0, common_1.Controller)('bookmarks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [bookmark_service_1.BookmarkService])
], BookmarkController);
//# sourceMappingURL=bookmark.controller.js.map