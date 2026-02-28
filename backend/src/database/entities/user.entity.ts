import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Resume } from './resume.entity';
import { Company } from './company.entity';
import { Application } from './application.entity';
import { Skill } from './skill.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';

export enum UserRole {
    USER = 'USER',
    EMPLOYER = 'EMPLOYER',
    ADMIN = 'ADMIN',
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

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true, length: 20 })
    phone: string;

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
}
