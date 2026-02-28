import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';

@Entity('bookmarks')
@Unique(['jobId', 'userId'])
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    jobId: number;

    @Column()
    userId: number;

    @ManyToOne(() => Job, (job) => job.bookmarks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobId' })
    job: Job;

    @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
