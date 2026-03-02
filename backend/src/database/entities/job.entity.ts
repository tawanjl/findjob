import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { Bookmark } from './bookmark.entity';

export enum JobType {
    FULL_TIME = 'Full-time',
    PART_TIME = 'Part-time',
    REMOTE = 'Remote',
    CONTRACT = 'Contract',
    INTERNSHIP = 'Internship',
}

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    salaryMin: number;

    @Column({ nullable: true })
    salaryMax: number;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
    jobType: JobType;

    @Column({ nullable: true })
    experience: string;

    @Column({ type: 'text', nullable: true })
    requirements: string;

    @Column({ default: true })
    active: boolean;

    @Column()
    companyId: number;

    @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'companyId' })
    company: Company;

    @OneToMany(() => Application, (application) => application.job)
    applications: Application[];

    @OneToMany(() => Bookmark, (bookmark) => bookmark.job)
    bookmarks: Bookmark[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
