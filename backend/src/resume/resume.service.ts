import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resume } from '../database/entities/resume.entity';

@Injectable()
export class ResumeService {
    constructor(
        @InjectRepository(Resume)
        private readonly resumeRepository: Repository<Resume>,
    ) { }

    async uploadResume(userId: number, fileUrl: string): Promise<Resume> {
        let resume = await this.resumeRepository.findOne({ where: { userId } });

        if (resume) {
            resume.url = fileUrl;
        } else {
            resume = this.resumeRepository.create({
                userId,
                url: fileUrl,
            });
        }

        return this.resumeRepository.save(resume);
    }

    async getResume(userId: number): Promise<Resume> {
        const resume = await this.resumeRepository.findOne({ where: { userId } });
        if (!resume) {
            throw new NotFoundException('Resume not found');
        }
        return resume;
    }
}
