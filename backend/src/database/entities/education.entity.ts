import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('educations')
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    institution: string;

    @Column()
    degree: string;

    @Column({ nullable: true })
    fieldOfStudy: string;

    @Column({ type: 'int' })
    startYear: number;

    @Column({ type: 'int', nullable: true })
    endYear: number | null;

    @Column({ default: false })
    isCurrent: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.educations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
