import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    findAll(query: any): Promise<import("../database/entities/job.entity").Job[]>;
    findMyJobs(req: any): Promise<import("../database/entities/job.entity").Job[]>;
    findOne(id: string): Promise<import("../database/entities/job.entity").Job>;
    create(req: any, createJobDto: CreateJobDto): Promise<import("../database/entities/job.entity").Job>;
    update(req: any, id: string, updateJobDto: UpdateJobDto): Promise<import("../database/entities/job.entity").Job>;
    remove(req: any, id: string): Promise<void>;
}
