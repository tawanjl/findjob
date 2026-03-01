import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('jobs')
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.jobService.findAll(query);
    }

    // ต้องอยู่ก่อน :id เพื่อไม่ให้ถูก catch โดย GET :id
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    @Get('my-jobs')
    findMyJobs(@Request() req) {
        return this.jobService.findMyJobs(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    @Post()
    create(@Request() req, @Body() createJobDto: CreateJobDto) {
        return this.jobService.create(req.user.userId, createJobDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
        return this.jobService.update(+id, req.user.userId, updateJobDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.EMPLOYER)
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.jobService.remove(+id, req.user.userId);
    }
}
