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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
const job_entity_1 = require("../database/entities/job.entity");
const application_entity_1 = require("../database/entities/application.entity");
let AdminService = class AdminService {
    userRepository;
    jobRepository;
    applicationRepository;
    constructor(userRepository, jobRepository, applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }
    async getStatistics() {
        const totalJobs = await this.jobRepository.count();
        const totalUsers = await this.userRepository.count();
        const totalApplications = await this.applicationRepository.count();
        const employerCount = await this.userRepository.count({ where: { role: user_entity_1.UserRole.EMPLOYER } });
        const seekerCount = await this.userRepository.count({ where: { role: user_entity_1.UserRole.USER } });
        const pendingEmployerCount = await this.userRepository.count({
            where: { role: user_entity_1.UserRole.EMPLOYER, approvalStatus: user_entity_1.EmployerStatus.PENDING },
        });
        return {
            totalJobs,
            totalUsers,
            employerCount,
            seekerCount,
            totalApplications,
            pendingEmployerCount,
        };
    }
    async getAllUsers() {
        return this.userRepository.find({
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'approvalStatus', 'createdAt'],
        });
    }
    async getPendingEmployers() {
        return this.userRepository.find({
            where: { role: user_entity_1.UserRole.EMPLOYER, approvalStatus: user_entity_1.EmployerStatus.PENDING },
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'approvalStatus', 'createdAt',
                'employerPhone', 'companyNameRequest', 'businessType', 'employerNote'],
            order: { createdAt: 'ASC' },
        });
    }
    async approveEmployer(id) {
        const user = await this.userRepository.findOne({ where: { id, role: user_entity_1.UserRole.EMPLOYER } });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบบัญชีนายจ้างนี้');
        await this.userRepository.update(id, { approvalStatus: user_entity_1.EmployerStatus.APPROVED });
        return { message: 'อนุมัตินายจ้างเรียบร้อยแล้ว' };
    }
    async rejectEmployer(id) {
        const user = await this.userRepository.findOne({ where: { id, role: user_entity_1.UserRole.EMPLOYER } });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบบัญชีนายจ้างนี้');
        await this.userRepository.update(id, { approvalStatus: user_entity_1.EmployerStatus.REJECTED });
        return { message: 'ปฏิเสธนายจ้างเรียบร้อยแล้ว' };
    }
    async suspendUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('ไม่พบผู้ใช้งานนี้');
        await this.userRepository.delete(id);
        return { message: 'ลบ/ระงับผู้ใช้งานเรียบร้อยแล้ว' };
    }
    async deleteJob(id) {
        const job = await this.jobRepository.findOne({ where: { id } });
        if (!job)
            throw new common_1.NotFoundException('ไม่พบงานนี้');
        await this.jobRepository.delete(id);
        return { message: 'ลบงานเรียบร้อยแล้ว' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map