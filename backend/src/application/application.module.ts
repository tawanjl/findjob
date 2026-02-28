import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application } from '../database/entities/application.entity';
import { Job } from '../database/entities/job.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Job]), CompanyModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule { }
