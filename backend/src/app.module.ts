import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { ResumeModule } from './resume/resume.module';
import { AdminModule } from './admin/admin.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CommunityModule } from './community/community.module';
import { WorkExperienceModule } from './work-experience/work-experience.module';
import { EducationModule } from './education/education.module';
import * as Joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().default(3306),
                DB_USER: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                PORT: Joi.number().default(3000),
            }),
        }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        CompanyModule,
        JobModule,
        ApplicationModule,
        ResumeModule,
        AdminModule,
        BookmarkModule,
        CommunityModule,
        WorkExperienceModule,
        EducationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
