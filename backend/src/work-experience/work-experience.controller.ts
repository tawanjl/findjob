import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';

@Controller('work-experience')
@UseGuards(JwtAuthGuard)
export class WorkExperienceController {
    constructor(private readonly service: WorkExperienceService) { }

    @Get()
    findAll(@Request() req: any) {
        return this.service.findAllByUser(req.user.userId);
    }

    @Post()
    create(@Request() req: any, @Body() dto: CreateWorkExperienceDto) {
        return this.service.create(req.user.userId, dto);
    }

    @Put(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() dto: Partial<CreateWorkExperienceDto>) {
        return this.service.update(req.user.userId, +id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.service.remove(req.user.userId, +id);
    }
}
