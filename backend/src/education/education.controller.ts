import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EducationService } from './education.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEducationDto } from './dto/create-education.dto';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {
    constructor(private readonly service: EducationService) { }

    @Get()
    findAll(@Request() req: any) {
        return this.service.findAllByUser(req.user.userId);
    }

    @Post()
    create(@Request() req: any, @Body() dto: CreateEducationDto) {
        return this.service.create(req.user.userId, dto);
    }

    @Put(':id')
    update(@Request() req: any, @Param('id') id: string, @Body() dto: Partial<CreateEducationDto>) {
        return this.service.update(req.user.userId, +id, dto);
    }

    @Delete(':id')
    remove(@Request() req: any, @Param('id') id: string) {
        return this.service.remove(req.user.userId, +id);
    }
}
