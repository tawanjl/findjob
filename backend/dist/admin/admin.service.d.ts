import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Job } from '../database/entities/job.entity';
import { Application } from '../database/entities/application.entity';
export declare class AdminService {
    private readonly userRepository;
    private readonly jobRepository;
    private readonly applicationRepository;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>);
    getStatistics(): Promise<{
        totalJobs: number;
        totalUsers: number;
        employerCount: number;
        seekerCount: number;
        totalApplications: number;
    }>;
    getAllUsers(): Promise<User[]>;
    suspendUser(id: number): Promise<{
        message: string;
    }>;
    deleteJob(id: number): Promise<{
        message: string;
    }>;
}
