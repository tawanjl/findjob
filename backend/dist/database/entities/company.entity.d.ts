import { User } from './user.entity';
import { Job } from './job.entity';
export declare class Company {
    id: number;
    name: string;
    description: string;
    logoUrl: string;
    bannerUrl: string;
    website: string;
    address: string;
    employerId: number;
    employer: User;
    jobs: Job[];
}
