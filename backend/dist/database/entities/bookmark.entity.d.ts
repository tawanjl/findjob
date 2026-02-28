import { Job } from './job.entity';
import { User } from './user.entity';
export declare class Bookmark {
    id: number;
    jobId: number;
    userId: number;
    job: Job;
    user: User;
    createdAt: Date;
}
