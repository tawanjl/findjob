import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) { }

    @Roles(UserRole.USER)
    @Post()
    apply(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
        return this.applicationService.apply(req.user.userId, createApplicationDto);
    }

    @Roles(UserRole.USER)
    @Get('my-applications')
    findMyApplications(@Request() req) {
        return this.applicationService.findMyApplications(req.user.userId);
    }

    @Roles(UserRole.EMPLOYER)
    @Get('job/:jobId')
    findApplicantsForJob(@Request() req, @Param('jobId') jobId: string) {
        return this.applicationService.findApplicantsForJob(req.user.userId, +jobId);
    }

    @Roles(UserRole.EMPLOYER)
    @Patch(':id/status')
    updateStatus(
        @Request() req,
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateApplicationStatusDto,
    ) {
        return this.applicationService.updateStatus(req.user.userId, +id, updateStatusDto);
    }
}
