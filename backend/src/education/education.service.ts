import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../database/entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';

@Injectable()
export class EducationService {
    constructor(
        @InjectRepository(Education)
        private readonly repo: Repository<Education>,
    ) { }

    async findAllByUser(userId: number) {
        return this.repo.find({
            where: { userId },
            order: { startYear: 'DESC' },
        });
    }

    async create(userId: number, dto: CreateEducationDto) {
        const entry = this.repo.create({ ...dto, userId });
        return this.repo.save(entry);
    }

    async update(userId: number, id: number, dto: Partial<CreateEducationDto>) {
        const entry = await this.repo.findOne({ where: { id } });
        if (!entry) throw new NotFoundException('ไม่พบข้อมูลการศึกษา');
        if (entry.userId !== userId) throw new ForbiddenException('ไม่มีสิทธิ์แก้ไขข้อมูลนี้');
        Object.assign(entry, dto);
        return this.repo.save(entry);
    }

    async remove(userId: number, id: number) {
        const entry = await this.repo.findOne({ where: { id } });
        if (!entry) throw new NotFoundException('ไม่พบข้อมูลการศึกษา');
        if (entry.userId !== userId) throw new ForbiddenException('ไม่มีสิทธิ์ลบข้อมูลนี้');
        await this.repo.delete(id);
        return { message: 'ลบข้อมูลการศึกษาเรียบร้อยแล้ว' };
    }
}
