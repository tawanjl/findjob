import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { Job } from './entities/job.entity';
import { Resume } from './entities/resume.entity';
import { Skill } from './entities/skill.entity';
import { Application } from './entities/application.entity';
import { Bookmark } from './entities/bookmark.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { WorkExperience } from './entities/work-experience.entity';
import { Education } from './entities/education.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 3306),
                username: configService.get<string>('DB_USER', 'root'),
                password: configService.get<string>('DB_PASSWORD', 'root'),
                database: configService.get<string>('DB_NAME', 'job_portal'),
                entities: [User, Company, Job, Resume, Skill, Application, Bookmark, Post, Comment, WorkExperience, Education],
                synchronize: true, // Only for development
            }),
        }),
    ],
})
export class DatabaseModule { }
