import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../database/entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Job } from '../database/entities/job.entity';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        private readonly companyService: CompanyService,
    ) { }

    async apply(userId: number, createApplicationDto: CreateApplicationDto): Promise<Application> {
        const job = await this.jobRepository.findOne({ where: { id: createApplicationDto.jobId } });
        if (!job || !job.active) {
            throw new NotFoundException('Job is not available');
        }

        const existingApp = await this.applicationRepository.findOne({
            where: { jobId: job.id, userId },
        });
        if (existingApp) {
            throw new ConflictException('You have already applied to this job');
        }

        const application = this.applicationRepository.create({
            ...createApplicationDto,
            userId,
        });
        return this.applicationRepository.save(application);
    }

    async findMyApplications(userId: number): Promise<Application[]> {
        return this.applicationRepository.find({
            where: { userId },
            relations: ['job', 'job.company'],
        });
    }

    async checkApplication(userId: number, jobId: number): Promise<{ applied: boolean }> {
        const existing = await this.applicationRepository.findOne({
            where: { userId, jobId },
        });
        return { applied: !!existing };
    }

    async findApplicantsForJob(employerId: number, jobId: number): Promise<Application[]> {
        const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['company'] });
        if (!job) throw new NotFoundException('Job not found');

        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company || job.company.id !== company.id) {
            throw new UnauthorizedException('You can only view applicants for your own jobs');
        }

        return this.applicationRepository.find({
            where: { jobId },
            relations: ['user', 'user.resume', 'user.workExperiences', 'user.educations'],
        });
    }

    async updateStatus(
        employerId: number,
        applicationId: number,
        updateStatusDto: UpdateApplicationStatusDto,
    ): Promise<Application> {
        const application = await this.applicationRepository.findOne({
            where: { id: applicationId },
            relations: ['job', 'job.company'],
        });

        if (!application) throw new NotFoundException('Application not found');

        const company = await this.companyService.findOneByEmployerId(employerId);
        if (!company || application.job.company.id !== company.id) {
            throw new UnauthorizedException('You can only update applicants for your own jobs');
        }

        application.status = updateStatusDto.status;
        if (updateStatusDto.employerReply !== undefined) {
            application.employerReply = updateStatusDto.employerReply;
        }
        return this.applicationRepository.save(application);
    }
}
