import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Resume } from './resume.entity';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { Skill } from './skill.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';

export enum UserRole {
    USER = 'USER',
    EMPLOYER = 'EMPLOYER',
    ADMIN = 'ADMIN',
}

export enum EmployerStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'enum', enum: EmployerStatus, nullable: true, default: null })
    approvalStatus: EmployerStatus | null;

    // ข้อมูลเพิ่มเติมสำหรับนายจ้าง (กรอกตอนสมัคร)
    @Column({ nullable: true, length: 20 })
    employerPhone: string;

    @Column({ nullable: true })
    companyNameRequest: string;

    @Column({ nullable: true })
    businessType: string;

    @Column({ type: 'text', nullable: true })
    employerNote: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true, length: 20 })
    phone: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    desiredJobTitle: string;

    @Column({ type: 'int', nullable: true })
    expectedSalary: number;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    portfolioUrl: string;

    @Column({ nullable: true })
    linkedinUrl: string;

    @Column({ type: 'date', nullable: true })
    availableFrom: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Resume, (resume) => resume.user)
    resume: Resume;

    @OneToOne(() => Company, (company) => company.employer)
    company: Company;

    @ManyToMany(() => Skill, (skill) => skill.users)
    @JoinTable({ name: 'user_skills' })
    skills: Skill[];

    @OneToMany(() => Application, (application) => application.user)
    applications: Application[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
    bookmarks: Bookmark[];

    @OneToMany(() => WorkExperience, (we) => we.user, { cascade: true })
    workExperiences: WorkExperience[];

    @OneToMany(() => Education, (edu) => edu.user, { cascade: true })
    educations: Education[];
}
