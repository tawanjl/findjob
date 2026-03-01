import { Repository } from 'typeorm';
import { Company } from '../database/entities/company.entity';
import { Job } from '../database/entities/job.entity';
import { Application } from '../database/entities/application.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyService {
    private readonly companyRepository;
    private readonly jobRepository;
    private readonly applicationRepository;
    constructor(companyRepository: Repository<Company>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>);
    create(employerId: number, createCompanyDto: CreateCompanyDto): Promise<Company>;
    findOneByEmployerId(employerId: number): Promise<Company | null>;
    findOneById(id: number): Promise<Company>;
    update(employerId: number, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
    updateLogo(employerId: number, logoUrl: string): Promise<Company>;
    updateBanner(employerId: number, bannerUrl: string): Promise<Company>;
    getEmployerStats(employerId: number): Promise<{
        totalJobs: number;
        activeJobs: number;
        closedJobs: number;
        totalApplications: number;
        pendingApplications: number;
        acceptedApplications: number;
        rejectedApplications: number;
    } | null>;
}
