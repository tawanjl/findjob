import { Repository } from 'typeorm';
import { Application } from '../database/entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Job } from '../database/entities/job.entity';
import { CompanyService } from '../company/company.service';
export declare class ApplicationService {
    private readonly applicationRepository;
    private readonly jobRepository;
    private readonly companyService;
    constructor(applicationRepository: Repository<Application>, jobRepository: Repository<Job>, companyService: CompanyService);
    apply(userId: number, createApplicationDto: CreateApplicationDto): Promise<Application>;
    findMyApplications(userId: number): Promise<Application[]>;
    checkApplication(userId: number, jobId: number): Promise<{
        applied: boolean;
    }>;
    findApplicantsForJob(employerId: number, jobId: number): Promise<Application[]>;
    updateStatus(employerId: number, applicationId: number, updateStatusDto: UpdateApplicationStatusDto): Promise<Application>;
}
