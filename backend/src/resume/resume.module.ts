import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { Resume } from '../database/entities/resume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resume])],
  providers: [ResumeService],
  controllers: [ResumeController],
})
export class ResumeModule { }
