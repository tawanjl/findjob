import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ nullable: true })
    bannerUrl: string;

    @Column({ nullable: true })
    website: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ unique: true })
    employerId: number;

    @OneToOne(() => User, (user) => user.company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employerId' })
    employer: User;

    @OneToMany(() => Job, (job) => job.company)
    jobs: Job[];
}
