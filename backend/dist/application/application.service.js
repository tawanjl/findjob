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
exports.ApplicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../database/entities/application.entity");
const job_entity_1 = require("../database/entities/job.entity");
const company_service_1 = require("../company/company.service");
let ApplicationService = class ApplicationService {
    applicationRepository;
    jobRepository;
    companyService;
    constructor(applicationRepository, jobRepository, companyService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.companyService = companyService;
    }
    async apply(userId, createApplicationDto) {
        const job = await this.jobRepository.findOne({ where: { id: createApplicationDto.jobId } });
        if (!job || !job.active) {
            throw new common_1.NotFoundException('Job is not available');
        }
        const existingApp = await this.applicationRepository.findOne({
            where: { jobId: job.id, userId },
        });
        if (existingApp) {
            throw new common_1.ConflictException('You have already applied to this job');
        }
        const application = this.applicationRepository.create({
            ...createApplicationDto,
            userId,
        });
        return this.applicationRepository.save(application);
    }
    async findMyApplications(userId) {
        return this.applicationRepository.find({
            where: { userId },
            relations: ['job', 'job.company'],
        });
    }
    async checkApplication(userId, jobId) {
        const existing = await this.applicationRepository.findOne({
            where: { userId, jobId },
        });
        return { applied: !!existing };
    }
    async findApplicantsForJob(employerId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['company'] });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company || job.company.id !== company.id) {
            throw new common_1.UnauthorizedException('You can only view applicants for your own jobs');
        }
        return this.applicationRepository.find({
            where: { jobId },
            relations: ['user', 'user.resume', 'user.workExperiences', 'user.educations'],
        });
    }
    async updateStatus(employerId, applicationId, updateStatusDto) {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['job', 'job.company'],
        });
        if (!application)
            throw new common_1.NotFoundException('Application not found');
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company || application.job.company.id !== company.id) {
            throw new common_1.UnauthorizedException('You can only update applicants for your own jobs');
        }
        application.status = updateStatusDto.status;
        if (updateStatusDto.employerReply !== undefined) {
            application.employerReply = updateStatusDto.employerReply;
        }
        return this.applicationRepository.save(application);
    }
};
exports.ApplicationService = ApplicationService;
exports.ApplicationService = ApplicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        company_service_1.CompanyService])
], ApplicationService);
//# sourceMappingURL=application.service.js.map