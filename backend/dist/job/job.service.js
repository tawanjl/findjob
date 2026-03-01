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
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../database/entities/job.entity");
const company_service_1 = require("../company/company.service");
let JobService = class JobService {
    jobRepository;
    companyService;
    constructor(jobRepository, companyService) {
        this.jobRepository = jobRepository;
        this.companyService = companyService;
    }
    async create(employerId, createJobDto) {
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company) {
            throw new common_1.NotFoundException('Please create a company profile first');
        }
        const newJob = this.jobRepository.create({
            ...createJobDto,
            companyId: company.id,
        });
        return this.jobRepository.save(newJob);
    }
    async findAll(query) {
        const qb = this.jobRepository.createQueryBuilder('job')
            .leftJoinAndSelect('job.company', 'company');
        if (!query.includeInactive) {
            qb.where('job.active = :active', { active: true });
        }
        if (query.title) {
            qb.andWhere('job.title LIKE :title', { title: `%${query.title}%` });
        }
        if (query.location) {
            qb.andWhere('job.location LIKE :location', { location: `%${query.location}%` });
        }
        if (query.jobType) {
            qb.andWhere('job.jobType = :jobType', { jobType: query.jobType });
        }
        if (query.minSalary) {
            const minNum = Number(query.minSalary);
            if (!isNaN(minNum)) {
                qb.andWhere('(job.salaryMax >= :minSalary OR job.salaryMin >= :minSalary)', { minSalary: minNum });
            }
        }
        return qb.getMany();
    }
    async findMyJobs(employerId) {
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company)
            return [];
        return this.jobRepository.find({
            where: { companyId: company.id },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const job = await this.jobRepository.findOne({ where: { id }, relations: ['company'] });
        if (!job) {
            throw new common_1.NotFoundException('Job not found');
        }
        return job;
    }
    async update(id, employerId, updateJobDto) {
        const job = await this.findOne(id);
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company || job.companyId !== company.id) {
            throw new common_1.UnauthorizedException('You can only update your own jobs');
        }
        Object.assign(job, updateJobDto);
        return this.jobRepository.save(job);
    }
    async remove(id, employerId) {
        const job = await this.findOne(id);
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company || job.companyId !== company.id) {
            throw new common_1.UnauthorizedException('You can only delete your own jobs');
        }
        await this.jobRepository.remove(job);
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        company_service_1.CompanyService])
], JobService);
//# sourceMappingURL=job.service.js.map