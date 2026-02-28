import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../database/entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        private readonly companyService: CompanyService,
    ) { }

    async create(employerId: number, createJobDto: CreateJobDto): Promise<Job> {
        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company) {
            throw new NotFoundException('Please create a company profile first');
        }
        const newJob = this.jobRepository.create({
            ...createJobDto,
            companyId: company.id,
        });
        return this.jobRepository.save(newJob);
    }

    async findAll(query: any): Promise<Job[]> {
        // Basic search filtering (can be expanded)
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
                // Return jobs where salaryMax >= minSalary OR salaryMin >= minSalary
                qb.andWhere('(job.salaryMax >= :minSalary OR job.salaryMin >= :minSalary)', { minSalary: minNum });
            }
        }

        return qb.getMany();
    }

    async findOne(id: number): Promise<Job> {
        const job = await this.jobRepository.findOne({ where: { id }, relations: ['company'] });
        if (!job) {
            throw new NotFoundException('Job not found');
        }
        return job;
    }

    async update(id: number, employerId: number, updateJobDto: UpdateJobDto): Promise<Job> {
        const job = await this.findOne(id);
        const company = await this.companyService.findOneByEmployerId(employerId);

        if (!company || job.companyId !== company.id) {
            throw new UnauthorizedException('You can only update your own jobs');
        }

        Object.assign(job, updateJobDto);
        return this.jobRepository.save(job);
    }

    async remove(id: number, employerId: number): Promise<void> {
        const job = await this.findOne(id);
        const company = await this.companyService.findOneByEmployerId(employerId);

        if (!company || job.companyId !== company.id) {
            throw new UnauthorizedException('You can only delete your own jobs');
        }

        await this.jobRepository.remove(job);
    }
}
