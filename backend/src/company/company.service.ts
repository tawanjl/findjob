import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../database/entities/company.entity';
import { Job } from '../database/entities/job.entity';
import { Application } from '../database/entities/application.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
    ) { }

    async create(employerId: number, createCompanyDto: CreateCompanyDto): Promise<Company> {
        const existing = await this.companyRepository.findOne({ where: { employerId } });
        if (existing) {
            throw new ConflictException('Company profile already exists for this employer');
        }
        const newCompany = this.companyRepository.create({ ...createCompanyDto, employerId });
        return this.companyRepository.save(newCompany);
    }

    async findOneByEmployerId(employerId: number): Promise<Company | null> {
        return this.companyRepository.findOne({ where: { employerId } });
    }

    // Public company profile – by company id (for job seekers)
    async findOneById(id: number): Promise<Company> {
        const company = await this.companyRepository.findOne({
            where: { id },
            relations: ['jobs'],
        });
        if (!company) throw new NotFoundException('ไม่พบข้อมูลบริษัท');
        return company;
    }

    async update(employerId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const company = await this.findOneByEmployerId(employerId);
        if (!company) throw new NotFoundException('Company profile not found');
        Object.assign(company, updateCompanyDto);
        return this.companyRepository.save(company);
    }

    async updateLogo(employerId: number, logoUrl: string): Promise<Company> {
        const company = await this.findOneByEmployerId(employerId);
        if (!company) throw new NotFoundException('Company profile not found');
        company.logoUrl = logoUrl;
        return this.companyRepository.save(company);
    }

    async updateBanner(employerId: number, bannerUrl: string): Promise<Company> {
        const company = await this.findOneByEmployerId(employerId);
        if (!company) throw new NotFoundException('Company profile not found');
        company.bannerUrl = bannerUrl;
        return this.companyRepository.save(company);
    }

    // สถิติสำหรับ Employer Dashboard
    async getEmployerStats(employerId: number) {
        const company = await this.companyRepository.findOne({ where: { employerId } });
        if (!company) return null;

        const totalJobs = await this.jobRepository.count({ where: { companyId: company.id } });
        const activeJobs = await this.jobRepository.count({ where: { companyId: company.id, active: true } });
        const closedJobs = totalJobs - activeJobs;

        // นับ applications ทั้งหมดของบริษัทนี้
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
}
