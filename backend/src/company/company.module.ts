import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from '../database/entities/company.entity';
import { Job } from '../database/entities/job.entity';
import { Application } from '../database/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Job, Application])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule { }
