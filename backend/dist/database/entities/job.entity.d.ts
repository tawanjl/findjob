import { Company } from './company.entity';
import { Application } from './application.entity';
import { Bookmark } from './bookmark.entity';
export declare enum JobType {
    FULL_TIME = "Full-time",
    PART_TIME = "Part-time",
    REMOTE = "Remote"
}
export declare class Job {
    id: number;
    title: string;
    description: string;
    salaryMin: number;
    salaryMax: number;
    location: string;
    jobType: JobType;
    experience: string;
    active: boolean;
    companyId: number;
    company: Company;
    applications: Application[];
    bookmarks: Bookmark[];
    createdAt: Date;
    updatedAt: Date;
}
