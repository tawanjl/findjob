import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkExperience } from '../database/entities/work-experience.entity';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';

@Injectable()
export class WorkExperienceService {
    constructor(
        @InjectRepository(WorkExperience)
        private readonly repo: Repository<WorkExperience>,
    ) { }

    async findAllByUser(userId: number) {
        return this.repo.find({
            where: { userId },
            order: { startDate: 'DESC' },
        });
    }

    async create(userId: number, dto: CreateWorkExperienceDto) {
        const entry = this.repo.create({ ...dto, userId });
        return this.repo.save(entry);
    }

    async update(userId: number, id: number, dto: Partial<CreateWorkExperienceDto>) {
        const entry = await this.repo.findOne({ where: { id } });
        if (!entry) throw new NotFoundException('ไม่พบข้อมูลประสบการณ์');
        if (entry.userId !== userId) throw new ForbiddenException('ไม่มีสิทธิ์แก้ไขข้อมูลนี้');
        Object.assign(entry, dto);
        return this.repo.save(entry);
    }

    async remove(userId: number, id: number) {
        const entry = await this.repo.findOne({ where: { id } });
        if (!entry) throw new NotFoundException('ไม่พบข้อมูลประสบการณ์');
        if (entry.userId !== userId) throw new ForbiddenException('ไม่มีสิทธิ์ลบข้อมูลนี้');
        await this.repo.delete(id);
        return { message: 'ลบข้อมูลประสบการณ์เรียบร้อยแล้ว' };
    }
}
