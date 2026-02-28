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
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../database/entities/post.entity");
const comment_entity_1 = require("../database/entities/comment.entity");
let CommunityService = class CommunityService {
    postRepository;
    commentRepository;
    constructor(postRepository, commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    async findAllPosts() {
        return this.postRepository.find({
            relations: ['user', 'comments'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOnePost(id) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'comments', 'comments.user'],
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        return post;
    }
    async createPost(userId, title, content) {
        const post = this.postRepository.create({ userId, title, content });
        return this.postRepository.save(post);
    }
    async deletePost(id, userId) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.userId !== userId)
            throw new common_1.UnauthorizedException('You can only delete your own posts');
        await this.postRepository.remove(post);
    }
    async createComment(postId, userId, content) {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        const comment = this.commentRepository.create({ postId, userId, content });
        return this.commentRepository.save(comment);
    }
    async deleteComment(id, userId) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.userId !== userId)
            throw new common_1.UnauthorizedException('You can only delete your own comments');
        await this.commentRepository.remove(comment);
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommunityService);
//# sourceMappingURL=community.service.js.map