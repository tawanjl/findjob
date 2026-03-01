import { Resume } from './resume.entity';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { Skill } from './skill.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';
export declare enum UserRole {
    USER = "USER",
    EMPLOYER = "EMPLOYER",
    ADMIN = "ADMIN"
}
export declare enum EmployerStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class User {
    id: number;
    email: string;
    password?: string;
    role: UserRole;
    approvalStatus: EmployerStatus | null;
    employerPhone: string;
    companyNameRequest: string;
    businessType: string;
    employerNote: string;
    firstName: string;
    lastName: string;
    phone: string;
    bio: string;
    location: string;
    desiredJobTitle: string;
    expectedSalary: number;
    avatarUrl: string;
    portfolioUrl: string;
    linkedinUrl: string;
    availableFrom: Date;
    createdAt: Date;
    updatedAt: Date;
    resume: Resume;
    company: Company;
    skills: Skill[];
    applications: Application[];
    posts: Post[];
    comments: Comment[];
    bookmarks: Bookmark[];
    workExperiences: WorkExperience[];
    educations: Education[];
}
