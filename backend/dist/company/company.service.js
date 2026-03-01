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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../database/entities/company.entity");
const job_entity_1 = require("../database/entities/job.entity");
const application_entity_1 = require("../database/entities/application.entity");
let CompanyService = class CompanyService {
    companyRepository;
    jobRepository;
    applicationRepository;
    constructor(companyRepository, jobRepository, applicationRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }
    async create(employerId, createCompanyDto) {
        const existing = await this.companyRepository.findOne({ where: { employerId } });
        if (existing) {
            throw new common_1.ConflictException('Company profile already exists for this employer');
        }
        const newCompany = this.companyRepository.create({ ...createCompanyDto, employerId });
        return this.companyRepository.save(newCompany);
    }
    async findOneByEmployerId(employerId) {
        return this.companyRepository.findOne({ where: { employerId } });
    }
    async findOneById(id) {
        const company = await this.companyRepository.findOne({
            where: { id },
            relations: ['jobs'],
        });
        if (!company)
            throw new common_1.NotFoundException('ไม่พบข้อมูลบริษัท');
        return company;
    }
    async update(employerId, updateCompanyDto) {
        const company = await this.findOneByEmployerId(employerId);
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        Object.assign(company, updateCompanyDto);
        return this.companyRepository.save(company);
    }
    async updateLogo(employerId, logoUrl) {
        const company = await this.findOneByEmployerId(employerId);
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        company.logoUrl = logoUrl;
        return this.companyRepository.save(company);
    }
    async updateBanner(employerId, bannerUrl) {
        const company = await this.findOneByEmployerId(employerId);
        if (!company)
            throw new common_1.NotFoundException('Company profile not found');
        company.bannerUrl = bannerUrl;
        return this.companyRepository.save(company);
    }
    async getEmployerStats(employerId) {
        const company = await this.companyRepository.findOne({ where: { employerId } });
        if (!company)
            return null;
        const totalJobs = await this.jobRepository.count({ where: { companyId: company.id } });
        const activeJobs = await this.jobRepository.count({ where: { companyId: company.id, active: true } });
        const closedJobs = totalJobs - activeJobs;
        const jobs = await this.jobRepository.find({ where: { companyId: company.id } });
        const jobIds = jobs.map(j => j.id);
        let totalApplications = 0;
        let pendingApplications = 0;
        let acceptedApplications = 0;
        let rejectedApplications = 0;
        if (jobIds.length > 0) {
            totalApplications = await this.applicationRepository
                .createQueryBuilder('app')
                .where('app.jobId IN (:...jobIds)', { jobIds })
                .getCount();
            pendingApplications = await this.applicationRepository
                .createQueryBuilder('app')
                .where('app.jobId IN (:...jobIds)', { jobIds })
                .andWhere("app.status = 'PENDING'")
                .getCount();
            acceptedApplications = await this.applicationRepository
                .createQueryBuilder('app')
                .where('app.jobId IN (:...jobIds)', { jobIds })
                .andWhere("app.status = 'ACCEPTED'")
                .getCount();
            rejectedApplications = await this.applicationRepository
                .createQueryBuilder('app')
                .where('app.jobId IN (:...jobIds)', { jobIds })
                .andWhere("app.status = 'REJECTED'")
                .getCount();
        }
        return {
            totalJobs,
            activeJobs,
            closedJobs,
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
        };
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CompanyService);
//# sourceMappingURL=company.service.js.map