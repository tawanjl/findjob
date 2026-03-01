import { JobType } from '../../database/entities/job.entity';
export declare class CreateJobDto {
    title: string;
    description: string;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    jobType?: JobType;
    experience?: string;
    requirements?: string;
    active?: boolean;
}
