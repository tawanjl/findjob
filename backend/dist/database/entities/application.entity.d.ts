import { Job } from './job.entity';
import { User } from './user.entity';
export declare enum ApplicationStatus {
    PENDING = "PENDING",
    SHORTLISTED = "SHORTLISTED",
    INTERVIEW = "INTERVIEW",
    REJECTED = "REJECTED",
    HIRED = "HIRED"
}
export declare class Application {
    id: number;
    jobId: number;
    userId: number;
    status: ApplicationStatus;
    coverLetter: string;
    job: Job;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
