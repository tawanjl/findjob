import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

export enum ApplicationStatus {
    PENDING = 'PENDING',
    SHORTLISTED = 'SHORTLISTED',
    INTERVIEW = 'INTERVIEW',
    REJECTED = 'REJECTED',
    HIRED = 'HIRED',
}

@Entity('applications')
@Unique(['jobId', 'userId'])
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    jobId: number;

    @Column()
    userId: number;

    @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
    status: ApplicationStatus;

    @Column({ type: 'text', nullable: true })
    coverLetter: string;

    @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobId' })
    job: Job;

    @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
