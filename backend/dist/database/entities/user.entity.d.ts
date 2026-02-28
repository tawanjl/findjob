import { Resume } from './resume.entity';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { Skill } from './skill.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
export declare enum UserRole {
    USER = "USER",
    EMPLOYER = "EMPLOYER",
    ADMIN = "ADMIN"
}
export declare class User {
    id: number;
    email: string;
    password?: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    resume: Resume;
    company: Company;
    skills: Skill[];
    applications: Application[];
    posts: Post[];
    comments: Comment[];
    bookmarks: Bookmark[];
}
