import { Repository } from 'typeorm';
import { Job } from '../database/entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CompanyService } from '../company/company.service';
export declare class JobService {
    private readonly jobRepository;
    private readonly companyService;
    constructor(jobRepository: Repository<Job>, companyService: CompanyService);
    create(employerId: number, createJobDto: CreateJobDto): Promise<Job>;
    findAll(query: any): Promise<Job[]>;
    findOne(id: number): Promise<Job>;
    update(id: number, employerId: number, updateJobDto: UpdateJobDto): Promise<Job>;
    remove(id: number, employerId: number): Promise<void>;
}
