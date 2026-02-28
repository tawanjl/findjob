import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('resumes')
export class Resume {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ unique: true })
    userId: number;

    @OneToOne(() => User, (user) => user.resume, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
