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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async create(userData) {
        const newUser = this.userRepository.create(userData);
        return this.userRepository.save(newUser);
    }
    async getMyProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['workExperiences', 'educations', 'skills', 'resume'],
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                bio: true,
                location: true,
                desiredJobTitle: true,
                expectedSalary: true,
                avatarUrl: true,
                portfolioUrl: true,
                linkedinUrl: true,
                availableFrom: true,
                createdAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งาน');
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งาน');
        Object.assign(user, dto);
        return this.userRepository.save(user);
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งาน');
        user.avatarUrl = avatarUrl;
        await this.userRepository.save(user);
        return { avatarUrl };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map