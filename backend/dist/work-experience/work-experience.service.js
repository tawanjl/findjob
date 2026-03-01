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
exports.WorkExperienceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const work_experience_entity_1 = require("../database/entities/work-experience.entity");
let WorkExperienceService = class WorkExperienceService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAllByUser(userId) {
        return this.repo.find({
            where: { userId },
            order: { startDate: 'DESC' },
        });
    }
    async create(userId, dto) {
        const entry = this.repo.create({ ...dto, userId });
        return this.repo.save(entry);
    }
    async update(userId, id, dto) {
        const entry = await this.repo.findOne({ where: { id } });
        if (!entry)
            throw new common_1.NotFoundException('ไม่พบข้อมูลประสบการณ์');
        if (entry.userId !== userId)
            throw new common_1.ForbiddenException('ไม่มีสิทธิ์แก้ไขข้อมูลนี้');
        Object.assign(entry, dto);
        return this.repo.save(entry);
    }
    async remove(userId, id) {
        const entry = await this.repo.findOne({ where: { id } });
        if (!entry)
            throw new common_1.NotFoundException('ไม่พบข้อมูลประสบการณ์');
        if (entry.userId !== userId)
            throw new common_1.ForbiddenException('ไม่มีสิทธิ์ลบข้อมูลนี้');
        await this.repo.delete(id);
        return { message: 'ลบข้อมูลประสบการณ์เรียบร้อยแล้ว' };
    }
};
exports.WorkExperienceService = WorkExperienceService;
exports.WorkExperienceService = WorkExperienceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(work_experience_entity_1.WorkExperience)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorkExperienceService);
//# sourceMappingURL=work-experience.service.js.map