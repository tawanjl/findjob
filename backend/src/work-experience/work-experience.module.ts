import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperience } from '../database/entities/work-experience.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WorkExperience])],
    controllers: [WorkExperienceController],
    providers: [WorkExperienceService],
})
export class WorkExperienceModule { }
