import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../database/entities/user.entity';
import { Job } from '../database/entities/job.entity';
import { Application } from '../database/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job, Application])],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule { }
